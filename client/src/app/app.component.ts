import { Component } from '@angular/core';
import { AccountService } from './_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  constructor(private accountService: AccountService, private router: Router) { }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
