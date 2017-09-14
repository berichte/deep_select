import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
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

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.selectedChanged.subscribe(selected => this.selected = selected);
    this.initPath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.ddList = this.items;
      this.initPath();
    }
  }

  itemSelected = (item) => this.selectedChanged.emit(item);

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
