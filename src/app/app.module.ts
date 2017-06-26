import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdMenuModule, MdInputModule, MdIconModule, MdSelectModule } from '@angular/material';

import { AppComponent } from './app.component';
import { DeepSelectComponent } from './deep-select/deep-select.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MdMenuModule, MdInputModule, MdIconModule, MdSelectModule
  ],
  declarations: [
    AppComponent,
    DeepSelectComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
