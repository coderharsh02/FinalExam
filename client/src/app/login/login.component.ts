import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { AccountService } from '../_services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../_services/account.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private accountService: AccountService, private router: Router, private route: ActivatedRoute) { }

  login() {
    this.accountService.login({ UserName: this.loginForm.value.username || "", Password: this.loginForm.value.password || '', Role: -1 }).subscribe({
      next: (data: any) => {
        if (data) {
          // alert('Login Successful');
          console.log(data);
          if (data.role == 0)
            this.router.navigateByUrl('/admin')
          else
            this.router.navigateByUrl('/student');
        }
      },
      error: err => {
        console.log(err);
        alert(err.error);
      }
    });
  }
}