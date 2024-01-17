import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { jobsInterface } from '../Interface/jobs';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs';
import { usersInterface } from '../Interface/users';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private apiUrl = 'https://localhost:44330/api/User/';
  constructor(private http: HttpClient) {}
  getJobs(): Observable<jobsInterface[]> {
    return this.http.get<jobsInterface[]>(this.apiUrl + 'jobs');
    // .pipe(catchError(this.errorHandler));
  }
  // IN PROCESS
  // errorHandler(error: HttpErrorResponse): Observable<never> {
  //   return throwError(() => {
  //     return error.message || 'Server Error';
  //   });
  // }
  getUsers(): Observable<usersInterface[]> {
    return this.http.get<usersInterface[]>(this.apiUrl + 'users');
  }
  getDashBoard(): Observable<usersInterface[]> {
    return this.http.get<usersInterface[]>(this.apiUrl + 'dashboard');
  }
  registerUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl + 'register', userData);
  }
  loginUser(userData: { email: string; password: string }): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<string>(this.apiUrl + 'login', userData, {
      headers,
      responseType: 'text' as 'json',
    });
  }
}
