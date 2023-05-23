import { Component, Input, OnInit } from '@angular/core';
import { UserDetail } from '../_interfaces/UserDetail';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-list-leave',
  templateUrl: './list-leave.component.html',
  styleUrls: ['./list-leave.component.css']
})
export class ListLeaveComponent implements OnInit {

  @Input() role = 1;
  @Input() username = '';
  
  UserDetail!: UserDetail;
  orignalUserLeaveHistory!: any[];
  userLeaveHistory!: any[];

  FilterDates = this.fb.group({
    FromDate: [Date, Validators.required],
    ToDate: [Date, Validators.required],
  })

  constructor(private fb: FormBuilder,private userService: UserService) {

  }

  ngOnInit(): void {
    this.getUserDetail();
  }

  getUserDetail() {
    this.userService.getUser(this.username).subscribe({
      next: (data: any) => {
        this.UserDetail = data;
        this.userLeaveHistory = data.userLeaveHistory;
        this.orignalUserLeaveHistory = data.userLeaveHistory;
      }
    });
  }

  get fromDate() {
    return this.FilterDates.get('FromDate');
  }

  get toDate() {
    return this.FilterDates.get('ToDate');
  }

  filterLeaves() {
    let fromDate = this.fromDate?.value;
    let toDate = this.toDate?.value;
    console.log(fromDate, toDate);
    this.userLeaveHistory = this.orignalUserLeaveHistory.filter(x => ((Number(new Date(x.fromDate)) >= Number(fromDate) && Number(new Date(x.fromDate)) <= Number(toDate))))
  }

  removeFilter() {
    this.FilterDates.reset();
    this.userLeaveHistory = this.orignalUserLeaveHistory;
  }

  approve(id: number) {
    console.log(id);
    this.userService.approveLeave(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getUserDetail();
      }
    });
  }

  reject(id: number) {
    console.log(id);
    this.userService.rejectLeave(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getUserDetail();
      }
    });
  }
}
