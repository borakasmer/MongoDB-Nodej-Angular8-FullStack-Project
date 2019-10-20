import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
let PersonService = class PersonService {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.baseUrl = "http://localhost:9480/people";
        this.baseUrlDesc = "http://localhost:9480/peopleDesc";
        this.pagingUrl = "http://localhost:9480/getpeoplebyPaging";
        this.updateUrl = "http://localhost:9480/updatePeople";
        this.inserteUrl = "http://localhost:9480/insertPeople";
        this.searchUrl = "http://localhost:9480/getpeopleStartsWith";
        this.deleteUrl = "http://localhost:9480/deletePeople";
        this.page = 1;
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }
    getPeopleList(desc = false) {
        let url = desc ? this.baseUrlDesc : this.baseUrl;
        return this.httpClient.get(url)
            .pipe(retry(1), catchError(this.errorHandel));
    }
    getPeopleListByPaging(pageNo) {
        return this.httpClient.get(this.pagingUrl + "/" + pageNo + "/5")
            .pipe(retry(1), catchError(this.errorHandel));
    }
    updatePerson(data) {
        return this.httpClient.post(this.updateUrl, JSON.stringify(data), this.httpOptions)
            .pipe(retry(1), catchError(this.errorHandel));
    }
    insertPeople(data) {
        return this.httpClient.post(this.inserteUrl, JSON.stringify(data), this.httpOptions)
            .pipe(retry(1), catchError(this.errorHandel));
    }
    searchPeopleByName(name) {
        return this.httpClient.get(this.searchUrl + "/" + name)
            .pipe(retry(1), catchError(this.errorHandel));
    }
    deletePeople(data) {
        return this.httpClient.post(this.deleteUrl, JSON.stringify(data), this.httpOptions)
            .pipe(retry(1), catchError(this.errorHandel));
    }
    errorHandel(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        }
        else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }
};
PersonService = tslib_1.__decorate([
    Injectable({ providedIn: 'root' })
], PersonService);
export { PersonService };
//# sourceMappingURL=personService.js.map