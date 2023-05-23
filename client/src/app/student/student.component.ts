import { Component } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  view: number = 1;
  username: string = 'sfsadf';
  constructor(private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user: any) => {
        this.username = user?.userName;
      },
    })
  }
} 
