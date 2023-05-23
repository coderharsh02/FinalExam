import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private accountService: AccountService) { }

  getUsers() {
    return this.http.get<any>(this.baseUrl + 'Users');
  }

  getUser(userName: string) {
    return this.http.get<any>(this.baseUrl + 'Users/' + userName);
  }

  addUserLeave(model:any) {
    return this.http.post<any>(this.baseUrl + 'UserLeaveHistories', model);
  }

  approveLeave(id: number) {
    return this.http.put<any>(this.baseUrl + 'UserLeaveHistories/' + id, {
      isApproved: true
    });
  }

  rejectLeave(id: number) {
    return this.http.put<any>(this.baseUrl + 'UserLeaveHistories/' + id, {
      isApproved: false
    });
  }
}
