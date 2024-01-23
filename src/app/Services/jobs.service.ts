import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
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
  private adminUrl = 'https://localhost:44330/api/Admin/';

  constructor(private http: HttpClient) {}
  getJobs(): Observable<jobsInterface[]> {
    return this.http.get<jobsInterface[]>(this.apiUrl + 'jobs');
    // .pipe(catchError(this.errorHandler));
  }
  // IN PROCESS
  // I don't remember what i was doing here
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
  addSchedule(date: any): Observable<any> {
    return this.http.post(
      'https://localhost:44330/api/Worker/add-schedule-request',
      date
    );
  }
  ApproveSchedule(scheduleId: number): Observable<any> {
    return this.http.post(
      `${this.adminUrl}approve-schedule-request?scheduleId=${scheduleId}`,
      scheduleId
    );
  }
  AddJob(jobTitle: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${this.adminUrl}add-new-job`,
      { title: jobTitle },
      { headers }
    );
  }
  BecomeGod(userId: number, newRoleId: number): Observable<any> {
    return this.http.post(`${this.adminUrl}change-user-role`, {
      userId: userId,
      newRoleId: newRoleId,
    });
  }

  DeleteSchedule(DeleteScheduleId: number): Observable<any> {
    return this.http.delete(
      `${this.adminUrl}delete-schedule/${DeleteScheduleId}`
    );
  }
  DeleteJob(jobId: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}delete-job/${jobId}`);
  }
  DeleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}delete-user/${userId}`);
  }
}
