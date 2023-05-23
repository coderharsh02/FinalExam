import { Component } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.css']
})
export class ListStudentComponent {

  View: number = 1;
  username: string = '';
  constructor(private userService: UserService) {
    
  }

  UserDetail: any;

  ngOnInit(): void {
    this.loadViewStudent();
  }

  loadViewStudent() {
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        this.UserDetail = data;
      }
    });
  }

  viewLeaves(username:string) {
    this.View = 2;
    this.username = username;
  }
}
