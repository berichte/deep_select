import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DeepSelectItem } from '../deep-select-item';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'deep-select',
  templateUrl: './deep-select.component.html',
  styleUrls: ['./deep-select.component.css']
})
export class DeepSelectComponent implements OnInit, OnChanges {

  @Input()
  items: Array<DeepSelectItem>;
  @Input()
  placeholder: string = 'placeholder';

  @Input()
  selected: DeepSelectItem;

  @Output()
  selectedChanged: EventEmitter<DeepSelectItem> = new EventEmitter<DeepSelectItem>();

  @Output()
  showingChildrenOf: EventEmitter<DeepSelectItem> = new EventEmitter<DeepSelectItem>();

  private ddList: Array<DeepSelectItem>;

  get selectedText() {
    return this.selected ? this.selected.text : '';
  }

  constructor() { }

  ngOnInit() {
    this.selectedChanged.subscribe(selected => this.selected = selected);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.ddList = this.items;
    }
  }

  itemSelected = (item) => this.selectedChanged.emit(item);

  showItemChilds = (event, item) => {
    console.log('show children', item);
    event.stopPropagation();
    this.ddList = item.children;
    this.showingChildrenOf.emit(item);
  }
}
