import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_interfaces/User';
import { DataService } from './data.service';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private dataService: DataService) { }

  setCurrentUser(user: User) {
    // localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  login(model: User) {
    return this.http.post<User>(this.baseUrl + 'Users/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  register(model: User) {
    return this.http.post<User>(this.baseUrl + 'Users', model);
  }

  logout() {
    this.currentUserSource.next(null);
  }
}
