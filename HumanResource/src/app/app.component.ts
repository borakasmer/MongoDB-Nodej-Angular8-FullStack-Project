import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { PersonService } from 'src/Service/personService';
import { Observable, fromEvent } from 'rxjs';
import { Person, Name } from 'src/Model/person';
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('userSearchInput', { static: false }) userSearchInput: ElementRef;
  isGetPeople: boolean = false;

  isInsert: boolean = false;

  optionSelect = ['male', 'female']
  personModel: Person;
  name: Name;
  isEdit: boolean = false;
  title = 'HumanResource';
  peopleList: any = [];
  currentPagecount: number = 1;
  isNextActive: boolean = true;
  isPreviewActive: boolean = false;
  constructor(public service: PersonService) { }

  ngAfterViewInit() {
    this.getPeople();
    fromEvent(this.userSearchInput.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
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
    ).subscribe((text: string) => {
      this.service.searchPeopleByName(text).subscribe((res) => {
        this.isGetPeople = false;
        console.log('res', res);
        this.peopleList = res;
      }, (err) => {
        console.log('error', err);
      });
    });
  }
  public getPeople(desc: boolean = false) {
    return this.service.getPeopleList(desc).subscribe((data: any = []) => {
      this.isGetPeople = true;
      this.peopleList = data.slice(0, 5);
      console.log(this.peopleList);
    });
  }

  public clickInsert() {

    this.personModel = new Person();
    this.name = new Name();
    this.personModel.name = this.name;

    this.isInsert = !this.isInsert;
    this.isEdit = false;
  };

  public Edit(data: Person) {
    this.isEdit = (this.personModel == data || this.isInsert == true) ? !this.isEdit : this.isEdit;
    this.personModel = data;
    this.isInsert = false;
  }

  public Delete(data: Person) {
    if (confirm("Silmek istediğinize emin misiniz ")) {
      this.service.deletePeople(data).subscribe((data: any) => {
        console.log("Sil:" + data.username);
        this.getPeople();
      });
    }
  }

  public Save() {
    if (this.isEdit) {
      this.service.updatePerson(this.personModel).subscribe((data: any) => { });
      this.personModel = null;
      this.isEdit = false;
    }
    else if (this.isInsert) {
      this.service.insertPeople(this.personModel).subscribe((data: any) => {
        this.getPeople(true);
      });
      this.personModel = null;
      this.isInsert = false;
    }
  }

  public Next() {
    this.currentPagecount = this.currentPagecount + 1 >= 0 ? this.currentPagecount + 1 : this.currentPagecount
    return this.service.getPeopleListByPaging(this.currentPagecount).subscribe((data: any = []) => {
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
  public Preview() {
    this.currentPagecount = this.currentPagecount - 1 > 0 ? this.currentPagecount - 1 : this.currentPagecount
    return this.service.getPeopleListByPaging(this.currentPagecount).subscribe((data: any = []) => {
      if (data.length > 0) {
        this.isNextActive = true;
        this.isPreviewActive = true;
        this.peopleList = data;
      }
      this.isPreviewActive = this.currentPagecount == 1 ? false : true;
      console.log(this.peopleList);
    });
  }
}
