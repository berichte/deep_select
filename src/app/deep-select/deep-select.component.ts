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

  @Input()
  maxLevelSelectedPath = 2;

  @Output()
  selectedChanged: EventEmitter<DeepSelectItem> = new EventEmitter<DeepSelectItem>();

  @Output()
  showingChildrenOf: EventEmitter<DeepSelectItem> = new EventEmitter<DeepSelectItem>();

  dsIsVisible: boolean = false;
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
    if (!this.dsIsVisible) return;
    let parentFound = false;
    while (target != null && !parentFound) {
      if (target === this.element.nativeElement) {
        parentFound = true;
      }
      target = target.parentElement;
    }
    if (!parentFound) {
      this.dsIsVisible = false;
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
    if (changes['selected'] && this.selected && this.selected !== null) {
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
    const notRootPath = path
      .filter(i => i.text !== this.pathRoot)
    if(this.maxLevelSelectedPath === 0)  {
      notRootPath.forEach((item, index) => {
        selectedPath += item.text + this.crumbSeperator;
      });
    } else {
      for(let i = 0; i < notRootPath.length; i++) {
        if (i + 1 < this.maxLevelSelectedPath) {
          selectedPath += notRootPath[i].text + this.crumbSeperator;
        } else if (i + 1 > this.maxLevelSelectedPath && i === notRootPath.length - 1) {
          selectedPath += ' ... ' + this.crumbSeperator;
        }
      }
    }
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

  isSelected = (item: DeepSelectItem, selected: DeepSelectItem): boolean => 
    (item && item !== null && selected && selected !== null && item.value === selected.value);

  toggleDropdown() {
    this.dsIsVisible = !this.dsIsVisible;
    // this.dsIsVisible ? this.dropdownOpened.emit() : this.dropdownClosed.emit();
  }
}
