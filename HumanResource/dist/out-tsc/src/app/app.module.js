import * as tslib_1 from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PersonService } from 'src/Service/personService';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    NgModule({
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map