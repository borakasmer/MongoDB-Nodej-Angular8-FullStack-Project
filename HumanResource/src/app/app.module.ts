import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PersonService } from 'src/Service/personService';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [PersonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
