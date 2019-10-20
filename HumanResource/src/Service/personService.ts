import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Person } from 'src/Model/person';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PersonService {
    baseUrl: string = "http://localhost:9480/people";
    baseUrlDesc: string = "http://localhost:9480/peopleDesc";
    pagingUrl: string = "http://localhost:9480/getpeoplebyPaging";
    updateUrl: string = "http://localhost:9480/updatePeople";
    inserteUrl: string = "http://localhost:9480/insertPeople";
    searchUrl: string = "http://localhost:9480/getpeopleStartsWith";
    deleteUrl: string = "http://localhost:9480/deletePeople";
    page: number = 1;
    constructor(private httpClient: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    public getPeopleList(desc: boolean = false): Observable<Person> {
        let url: string = desc ? this.baseUrlDesc : this.baseUrl;

        return this.httpClient.get<Person>(url)
            .pipe(
                retry(1),
                catchError(this.errorHandel)
            )
    }
    public getPeopleListByPaging(pageNo: number): Observable<Person> {
        return this.httpClient.get<Person>(this.pagingUrl + "/" + pageNo + "/5")
            .pipe(
                retry(1),
                catchError(this.errorHandel)
            )
    }


    public updatePerson(data: Person): Observable<any> {
        return this.httpClient.post<Person>(this.updateUrl, JSON.stringify(data), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandel)
            )
    }

    public insertPeople(data: Person): Observable<any> {
        return this.httpClient.post<Person>(this.inserteUrl, JSON.stringify(data), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandel)
            )
    }

    public searchPeopleByName(name: string): Observable<Person> {
        return this.httpClient.get<Person>(this.searchUrl + "/" + name)
            .pipe(
                retry(1),
                catchError(this.errorHandel)
            )
    }

    public deletePeople(data: Person): Observable<any> {
        return this.httpClient.post<Person>(this.deleteUrl, JSON.stringify(data), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandel)
            )
    }

    errorHandel(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }
}