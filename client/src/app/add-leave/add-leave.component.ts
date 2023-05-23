import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { User } from '../_interfaces/User';
import { DataService } from '../_services/data.service';
import { UserLeaveBalance } from '../_interfaces/UserLeaveBalance';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UserDetail } from '../_interfaces/UserDetail';
import { UserService } from '../_services/user.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.css']
})
export class AddLeaveComponent implements OnInit {

  LeaveApplicationForm!: FormGroup;
  UserDetail!: UserDetail;
  progress: number = 0;
  message: string = "";
  @Output() public onUploadFinished = new EventEmitter();

  DatePickerRange = {
    minDate: new Date(),
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  }

  constructor(private fb: FormBuilder, private accountService: AccountService, private userService: UserService, private router: Router, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.getUserDetail();

    this.LeaveApplicationForm = this.fb.group({
      LeaveType: ['', Validators.required],
      FromDate: [Date, Validators.required],
      ToDate: [Date, Validators.required],
      Reason: ['', Validators.required],
      file: [''],
    })

    this.leaveType?.valueChanges.forEach((value: string) => {
      this.clearDateInput();
      this.onTypeChange();
    });
  }

  getUserDetail() {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user: any) => {
        this.userService.getUser(user?.userName || '').subscribe({
          next: (data: any) => {
            this.UserDetail = data;
            console.log(JSON.stringify(this.UserDetail));
          }
        });
      },
    })
    // this.UserDetail = JSON.parse(`{ "userName": "rama", "password": "ram@1234", "role": 1, "userLeaveBalance": { "userName": "rama", "pl": 12, "cl": 6, "sl": 0 }, "userLeaveHistory": [{ "id": 22, "userName": "rama", "fromDate": "2023-05-16T00:00:00", "toDate": "2023-05-18T00:00:00", "reason": "s", "numberOfDays": 3, "leaveType": "sl", "isApproved": null }, { "id": 23, "userName": "rama", "fromDate": "2023-05-16T00:00:00", "toDate": "2023-05-17T00:00:00", "reason": "s", "numberOfDays": 2, "leaveType": "sl", "isApproved": null }, { "id": 24, "userName": "rama", "fromDate": "2023-05-16T00:00:00", "toDate": "2023-05-16T00:00:00", "reason": "sd", "numberOfDays": 1, "leaveType": "sl", "isApproved": null }] }`);
  }

  weekendsDatesFilter = (d: Date): boolean => {
    const day = d.getDay();
    return day !== 0 && day !== 6;
  }

  get fromDate() {
    return this.LeaveApplicationForm.get('FromDate');
  }

  get toDate() {
    return this.LeaveApplicationForm.get('ToDate');
  }

  get reason() {
    return this.LeaveApplicationForm.get('Reason');
  }

  get leaveType() {
    return this.LeaveApplicationForm.get('LeaveType');
  }

  get file() {
    return this.LeaveApplicationForm.get('file');
  }

  fromDateInputEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    let selectedDate = new Date(event.value || '');
    if (this.leaveType?.value == 'pl') {
      const diffTime = Math.abs(Number(selectedDate) - Number(new Date()));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - this.countWeekendDays(new Date(), selectedDate);

      if (diffDays >= 15) {
        this.DatePickerRange.maxDate = new Date(selectedDate.setDate(selectedDate.getDate() + this.UserDetail.userLeaveBalance.pl - 1));
      }
      else if (diffDays >= 7) {
        this.DatePickerRange.maxDate = new Date(selectedDate.setDate(selectedDate.getDate() + (this.UserDetail.userLeaveBalance.pl > 3 ? 3 : this.UserDetail.userLeaveBalance.pl) - 1));
      }
      else {
        this.DatePickerRange.maxDate = new Date(new Date().setDate(selectedDate.getDate()));
      }
    }
    else if (this.leaveType?.value == 'cl') {
      let maxCLDate = new Date(new Date().setDate(selectedDate.getDate() + this.UserDetail.userLeaveBalance.cl));
      const diffTime = Number(maxCLDate) - Number(this.DatePickerRange.maxDate);
      if (diffTime < 0) {
        this.DatePickerRange.maxDate = maxCLDate;
      }
    }
    else if (this.leaveType?.value == 'sl') {
      const diffTime = Math.abs(Number(selectedDate) - Number(new Date()));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (this.UserDetail.userLeaveBalance.sl < diffDays) {
        this.DatePickerRange.maxDate = new Date(new Date().setDate(this.DatePickerRange.minDate.getDate() + this.UserDetail.userLeaveBalance.sl - 1));
      }
    }
    this.DatePickerRange.maxDate.setDate(this.DatePickerRange.maxDate.getDate() + this.countWeekendDays(selectedDate, this.DatePickerRange.maxDate));
    this.DatePickerRange.maxDate.setDate(this.DatePickerRange.maxDate.getDate() + this.countWeekendDays(selectedDate, this.DatePickerRange.maxDate));
  }

  countWeekendDays(fromDate: Date, toDate: Date) {
    var ndays = 1 + Math.round((toDate.getTime() - fromDate.getTime()) / (24 * 3600 * 1000));
    var nsaturdays = Math.floor((fromDate.getDay() + ndays) / 7);
    return 2 * nsaturdays + Number(fromDate.getDay() == 0) - Number(toDate.getDay() == 6);
  }

  onTypeChange() {
    this.file?.removeValidators(Validators.required);
    if (this.leaveType?.value == 'cl') {
      this.DatePickerRange.minDate = new Date(new Date().setDate(new Date().getDate() + 3));
      let weekDays = this.countWeekendDays(new Date(), this.DatePickerRange.minDate);
      this.DatePickerRange.minDate.setDate(this.DatePickerRange.minDate.getDate() + weekDays);
      this.DatePickerRange.maxDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    }
    else if (this.leaveType?.value == 'sl') {
      this.file?.addValidators(Validators.required);
      this.DatePickerRange.minDate = new Date(new Date().setDate(new Date().getDate() - 2));
      this.DatePickerRange.maxDate = new Date(new Date());
      let weekDays = this.countWeekendDays(this.DatePickerRange.minDate, this.DatePickerRange.maxDate);
      this.DatePickerRange.minDate.setDate(this.DatePickerRange.minDate.getDate() - weekDays);
    }
    else if (this.leaveType?.value == 'pl') {
      this.DatePickerRange.minDate = new Date(new Date().setDate(new Date().getDate() + 1));
      this.DatePickerRange.maxDate = new Date(new Date().getFullYear(), 11, 31);
    }
  }

  clearDateInput() {
    this.fromDate?.setValue('');
    this.toDate?.setValue('');
    this.onTypeChange();
  }

  AddLeave(data: any, files: FileList | null = null) {
    const NumberOfDays = Math.ceil(Math.abs(Number(data.FromDate) - Number(data.ToDate)) / (1000 * 60 * 60 * 24)) + 1 - this.countWeekendDays(data.FromDate, data.ToDate);
    data = { UserName: this.UserDetail.userName, NumberOfDays: NumberOfDays, ...data }
    console.log(data);
    this.userService.addUserLeave(data).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data.leaveType == 'sl') {
          if (files == null) { return; }
          let fileToUpload = <File>files[0];
          const formData = new FormData();
          formData.append('file', fileToUpload, data.id + fileToUpload.name.substring(fileToUpload.name.lastIndexOf('.')));

          this.http.post('https://localhost:7127/api/uploadCertificate', formData, { reportProgress: true, observe: 'events' }).subscribe({
            next: (event) => {
              if (event.type === HttpEventType.UploadProgress)
                this.progress = Math.round(100 * event.loaded / (event.total || 0));
              else if (event.type === HttpEventType.Response) {
                this.message = 'Upload success.';
                this.onUploadFinished.emit(event.body);
                alert("Leave Added Successfully!");
                this.LeaveApplicationForm.reset();
                this.getUserDetail();
              }
            },
            error: (err: HttpErrorResponse) => console.log(err)
          });
        }
        else {
          alert("Leave Added Successfully!");
          this.LeaveApplicationForm.reset();
          this.getUserDetail();
        }
      }
    });
  }

  uploadFile(files: FileList | null) {

  }
}
