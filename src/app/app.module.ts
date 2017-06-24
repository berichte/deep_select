import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DeepSelectComponent } from './deep-select/deep-select.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    DeepSelectComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
