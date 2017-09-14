import { Component, OnInit } from '@angular/core';
import { DeepSelectItem } from './deep-select/deep-select-item';
import { exampleItems } from './expample.items';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  deepSelectItems: Array<DeepSelectItem>;

  ngOnInit(): void {
    this.deepSelectItems = exampleItems;
  }
}
