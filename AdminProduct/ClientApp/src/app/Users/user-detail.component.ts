import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../services/common.service';
import { UserDetail } from '../model/user-detail.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../common/dialog.component';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {

  userDetails: UserDetail[];
  userData = new UserDetail();
  userId: number;
  dialogTitle = "";

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'action'];
  dataSource: MatTableDataSource<UserDetail>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private commonService: CommonService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getUsers();
  }
  /**
   *get user details  
   */
  getUsers() {
    this.commonService.getUserDetails().subscribe(data => {
      this.userDetails = data;
      this.dataSource = new MatTableDataSource(this.userDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * add User
   * @param id: product id
   */
  addUser() {
    this.userData = new UserDetail();
    this.userData.Id = 0;
    this.dialogTitle = "Add User";
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: this.dialogTitle, type: 'UserDetail', details: this.userData },
      panelClass: 'edit-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    });
  }


  ///**
  // * edit User
  // * @param userId: user id
  // */
  editUser(userId: number) {
    this.userData = new UserDetail();
    this.dialogTitle = "Edit User";
    this.commonService.getUserDetailById(userId).subscribe(data => {
      this.userData = data[0];
      const dialogRef = this.dialog.open(DialogComponent, {
        data: { title: this.dialogTitle, type: 'UserDetail', details: this.userData },
        panelClass: 'edit-dialog'
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getUsers();
      });
    });
  }

  /**
   * Delete User 
   * @param userId: user id
   */
  deleteUser(userId: number) {
    this.dialogTitle = "Delete User";
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: this.dialogTitle, type: 'DeleteConfirmation', id: userId,
        deleteType: "UserDetail"
      },
      panelClass: 'delete-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    });
  }

  /**
   * search value from table
   * @param filterValue
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
