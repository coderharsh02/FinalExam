import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(private accountService: AccountService, private fb: FormBuilder) { }

  login() {
    this.accountService.register({ UserName: this.registerForm.value.username || "", Password: this.registerForm.value.password || '', Role: 1 }).subscribe({
      next: (data: any) => {
        if (data) {
          alert('User added successfully!');
          this.registerForm.reset();
        }
      },
      error: err => {
        console.log(err);
        alert(err.error);
      }
    });
  }
}
