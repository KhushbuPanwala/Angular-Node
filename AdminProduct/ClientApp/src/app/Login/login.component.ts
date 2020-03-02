import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserDetail } from '../model/user-detail.model';
import { DialogComponent } from '../common/dialog.component';
import { MatDialog } from '@angular/material';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userDetails: any;
  userData = new UserDetail();

  constructor(
    private http: HttpClient, private router: Router, private dialog: MatDialog,
    private commonService: CommonService) { }

  ngOnInit() {
    localStorage.removeItem('loginId');
    this.http.get('./assets/UserDetail.json').subscribe(
      data => {
        this.userDetails = data;
      });
  }
  onSubmit() {
    let userData = {
      "Email": this.userData.Email,
      "Password": this.userData.Password
    }

    this.commonService.authenticateUser(userData).subscribe(result => {
      console.log(result);
      if (result.length !== 0) {
        localStorage.setItem("loginId", JSON.stringify(result[0].Id));
        this.router.navigate(['/Home']);

      }
      //else {
      //  res.redirect('/');
      //}
    });

  }

  dialogTitle = "";
  action: string;
  message: string;

  openUserRegistration() {
    this.userData = new UserDetail();
    this.message = "User added suceessfully";
    this.userData.Id = 0;
    this.dialogTitle = "User Registration";
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: this.dialogTitle, type: 'UserDetail', details: this.userData },
      panelClass: 'edit-dialog'
    });
  }
}
