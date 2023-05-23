import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { StudentComponent } from './student/student.component';
import { AuthGuard } from './_guards/auth.guard';
import { AddLeaveComponent } from './add-leave/add-leave.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  // { path: 'add-leave', component: AddLeaveComponent },
  // { path: 'approve-leave', component: ApproveLeaveComponent },
  // { path: 'list-leave', component: ListLeaveComponent },
  {
    path: 'admin', component: AdminComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    }
  },
  {
    path: 'student', component: StudentComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'student'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
