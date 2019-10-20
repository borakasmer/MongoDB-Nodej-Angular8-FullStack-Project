import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Person, Name } from 'src/Model/person';
import { map, filter, debounceTime } from 'rxjs/operators';
let AppComponent = class AppComponent {
    constructor(service) {
        this.service = service;
        this.isGetPeople = false;
        this.isInsert = false;
        this.optionSelect = ['male', 'female'];
        this.isEdit = false;
        this.title = 'HumanResource';
        this.peopleList = [];
        this.currentPagecount = 1;
        this.isNextActive = true;
        this.isPreviewActive = false;
    }
    ngAfterViewInit() {
        this.getPeople();
        fromEvent(this.userSearchInput.nativeElement, 'keyup').pipe(
        // get value
        map((event) => {
            event.target.value.length < 3 && !this.isGetPeople ? this.getPeople() : null;
            return event.target.value;
        })
        // if character length greater then 2
        , filter(res => res.length > 2)
        // Time in milliseconds between key events
        , debounceTime(250)
        // If previous query is diffent from current   
        // , distinctUntilChanged()
        // subscription for response
        ).subscribe((text) => {
            this.service.searchPeopleByName(text).subscribe((res) => {
                this.isGetPeople = false;
                console.log('res', res);
                this.peopleList = res;
            }, (err) => {
                console.log('error', err);
            });
        });
    }
    getPeople(desc = false) {
        return this.service.getPeopleList(desc).subscribe((data = []) => {
            this.isGetPeople = true;
            this.peopleList = data.slice(0, 5);
            console.log(this.peopleList);
        });
    }
    clickInsert() {
        this.personModel = new Person();
        this.name = new Name();
        this.personModel.name = this.name;
        this.isInsert = !this.isInsert;
        this.isEdit = false;
    }
    ;
    Edit(data) {
        this.isEdit = (this.personModel == data || this.isInsert == true) ? !this.isEdit : this.isEdit;
        this.personModel = data;
        this.isInsert = false;
    }
    Delete(data) {
        this.service.deletePeople(data).subscribe((data) => {
            console.log("Sil:" + data.username);
        }, () => { }, () => this.getPeople());
    }
    Save() {
        if (this.isEdit) {
            this.service.updatePerson(this.personModel).subscribe((data) => { });
            this.personModel = null;
            this.isEdit = false;
        }
        else if (this.isInsert) {
            this.service.insertPeople(this.personModel).subscribe((data) => {
                this.getPeople(true);
            });
            this.personModel = null;
            this.isInsert = false;
        }
    }
    Next() {
        this.currentPagecount = this.currentPagecount + 1 >= 0 ? this.currentPagecount + 1 : this.currentPagecount;
        return this.service.getPeopleListByPaging(this.currentPagecount).subscribe((data = []) => {
            if (data.length == 0) {
                this.currentPagecount = this.currentPagecount - 1;
                this.isNextActive = false;
            }
            else {
                this.isNextActive = true;
                this.peopleList = data;
                this.isPreviewActive = true;
            }
            console.log(this.peopleList);
        });
    }
    Preview() {
        this.currentPagecount = this.currentPagecount - 1 > 0 ? this.currentPagecount - 1 : this.currentPagecount;
        return this.service.getPeopleListByPaging(this.currentPagecount).subscribe((data = []) => {
            if (data.length > 0) {
                this.isNextActive = true;
                this.isPreviewActive = true;
                this.peopleList = data;
            }
            this.isPreviewActive = this.currentPagecount == 1 ? false : true;
            console.log(this.peopleList);
        });
    }
};
tslib_1.__decorate([
    ViewChild('userSearchInput', { static: false })
], AppComponent.prototype, "userSearchInput", void 0);
AppComponent = tslib_1.__decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map