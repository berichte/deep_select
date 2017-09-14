import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DeepSelectItem } from './deep-select-item';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'deep-select',
  templateUrl: './deep-select.component.html',
  styleUrls: ['./deep-select.component.scss']
})
export class DeepSelectComponent implements OnInit, OnChanges {

  @Input()
  items: Array<DeepSelectItem>;
  @Input()
  placeholder = '';

  @Input()
  pathRoot = '**';
  @Input()
  crumbSeperator = '.';

  @Input()
  selected: DeepSelectItem;

  @Output()
  selectedChanged: EventEmitter<DeepSelectItem> = new EventEmitter<DeepSelectItem>();

  @Output()
  showingChildrenOf: EventEmitter<DeepSelectItem> = new EventEmitter<DeepSelectItem>();

  isVisible: boolean = false;
  @Output() dropdownOpened = new EventEmitter();
  @Output() dropdownClosed = new EventEmitter();

  private ddList: Array<DeepSelectItem>;

  get selectedText() {
    return this.selected ? this.selected.text : '';
  }

  public selectedPath: string;

  private path = new Array<DeepSelectItem>();

  @HostListener('document: click', ['$event.target'])
  onClick(target: HTMLElement | null) {
    if (!this.isVisible) return;
    let parentFound = false;
    while (target != null && !parentFound) {
      if (target === this.element.nativeElement) {
        parentFound = true;
      }
      target = target.parentElement;
    }
    if (!parentFound) {
      this.isVisible = false;
      this.dropdownClosed.emit();
    }
  }

  constructor(private element: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.selectedChanged.subscribe(selected => this.selected = selected);
    //this.initPath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.ddList = this.items;
      this.initPath();
    }
    if (changes['selected']) {
      const path = this.findPath(this.selected, this.items, new Array<DeepSelectItem>());
      if(path) {
        const root = {
          text: this.pathRoot,
          children: this.items,
          value: 0
        };
        this.path = [root, ...path];
        const parentList = this.path[this.path.length - 1].children;
        this.ddList = parentList ? parentList : this.ddList;
        this.selectedPath = this.buildSelectedPathString(this.selected, this.path);
        this._changeDetectorRef.detectChanges();
      }
    }
  }

  findPath = (item: DeepSelectItem, items: Array<DeepSelectItem>, path: Array<DeepSelectItem> = new Array<DeepSelectItem>()): Array<DeepSelectItem> | undefined => {
    const found = items.find(i => i.value === item.value);
    if (found) {
      return path;
    } else {
      let result;
      const childless = items
        .filter(i => i.children);
      for (let i = 0; i < childless.length; i++) {
        const children = childless[i].children;
        if (children) {
          const p = path.concat([childless[i]]);
          result = this.findPath(item, children, p);
          if(result) {
            return result;
          }
        }
      }
      return undefined;
    }
  }

  itemSelected = (item: DeepSelectItem) => {
    this.selectedPath = this.buildSelectedPathString(item, this.path);
    this.selectedChanged.emit(item);
  }

  buildSelectedPathString = (item: DeepSelectItem, path: Array<DeepSelectItem>): string => {
    let selectedPath = '';
    path
      .filter(i => i.text !== this.pathRoot)
      .forEach(i => selectedPath += i.text + this.crumbSeperator);
    selectedPath += item.text;
    return selectedPath;
  }

  showItemChilds = (event, item) => {
    event.stopPropagation();
    this.ddList = item.children;
    this.path.push(item);
    this.showingChildrenOf.emit(item);
  }

  initPath = () => {
    this.path = new Array<DeepSelectItem>();
    this.path.push({
      text: this.pathRoot,
      children: this.items,
      value: 0
    });
  }

  crumbClicked = (event, crumb: DeepSelectItem) => {
    const i = this.path.indexOf(crumb);
    this.path = this.path.slice(0, i);
    this.showItemChilds(event, crumb);
  }

  toggleDropdown() {
    this.isVisible = !this.isVisible;
    this.isVisible ? this.dropdownOpened.emit() : this.dropdownClosed.emit();
  }
}
