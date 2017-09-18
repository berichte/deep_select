import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeepSelectComponent } from './deep-select.component';
import { FormsModule } from '@angular/forms';
import { OrderBy } from './order-by.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    DeepSelectComponent,
    OrderBy
  ],
  exports: [
    DeepSelectComponent
  ]
})
export class DeepSelectModule { }
