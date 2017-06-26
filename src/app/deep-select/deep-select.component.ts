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

  @Output()
  selected: EventEmitter<DeepSelectItem> = new EventEmitter<DeepSelectItem>();

  @Output()
  showingChildrenOf: EventEmitter<DeepSelectItem> = new EventEmitter<DeepSelectItem>();

  private ddList: Array<DeepSelectItem>;
  private path = new Array<DeepSelectItem>();

  constructor() { }

  ngOnInit() {
    this.initPath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.ddList = this.items;
      this.initPath();
    }
  }

  initPath = () => {
    this.path = new Array<DeepSelectItem>();
    this.path.push({
      text: 'home',
      children: this.items,
      value: 0
    });
  }

  itemSelected = (item: DeepSelectItem) => this.selected.emit(item);

  showItemChilds = (event, item: DeepSelectItem) => {
    event.stopPropagation();
    this.ddList = item.children;
    this.path.push(item);
    this.showingChildrenOf.emit(item);
  }

  crumbClicked = (event, crumb: DeepSelectItem) => {
    const i = this.path.indexOf(crumb);
    this.path = this.path.slice(0, i);
    this.showItemChilds(event, crumb);
  }
}
