import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_interfaces/User';
import { UserLeaveBalance } from '../_interfaces/UserLeaveBalance';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  Users: User[] = [];
  UserLeaveBalance: UserLeaveBalance[] = [];
  // UserLeaveHistory: any[] = [];

  constructor(private http: HttpClient) {
    this.http.get<any>("./assets/data.json").subscribe({
      next: data => {
        this.Users = data.Users;
        this.UserLeaveBalance = data.UserLeaveBalance;
      }
    });
  }

  verifyUser(userName: string, password: string) {
    let user = this.Users.find(x => x.UserName == userName && x.Password == password);
    if (user) {
      return user;
    }
    else {
      return undefined;
    }
  }

  getUserLeaveBalance(userName: string) {
    let userLeaveBalance = this.UserLeaveBalance.find(x => x.UserName == userName);
    if (userLeaveBalance) {
      return userLeaveBalance;
    }
    else {
      return undefined;
    }
  }

}
