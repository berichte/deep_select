import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeepSelectComponent } from 'app/deep-select/deep-select.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    DeepSelectComponent
  ],
  exports: [
    DeepSelectComponent
  ]
})
export class DeepSelectModule { }
