import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  
  Users: any = [];
  
  constructor(private userService: UserService) { }
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        this.Users = data;
        console.log(data);
      },
      error: err => {
        console.log(err);
        alert(err.error);
      }
    });
  }
}
