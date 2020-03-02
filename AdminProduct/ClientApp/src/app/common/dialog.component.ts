import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CommonService } from '../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  genders: string[] = ['Male', 'Female', 'Others'];

  id: number;
  action: string;

  message: string = "";
  mobnumPattern = "^[6-9][0-9]{9}$";

  details: any;

  myForm = this.formbuilder.group({
    contact_no: ['', [Validators.required, Validators.pattern(this.mobnumPattern)]],
  });

  constructor(private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private formbuilder: FormBuilder,
    private commonService: CommonService, private _snackBar: MatSnackBar) {
    this.details = this.data.details;
  }

  ngOnInit() { }

  /**
  * close dialog
  */
  cancel() {
    this.dialogRef.close();
  }

  /**
  * Open Snackbar
  */
  openSnackBar() {
    this._snackBar.open(this.message, this.action, {
      duration: 2000,
      panelClass: ['snack-bar']
    });
    this.cancel();
  }

  /**
   * Delete items
   * @param type: defines which item deleted
   */
  delete(deleteType: string) {
    let id = this.data.id;
    if (deleteType == "UserDetail") {
      this.commonService.deleteUser(id).subscribe(data => {
        if (data) {
          this.message = "Record Deleted Successfully!!!";
          this.openSnackBar();
        }
      });
    }
    if (deleteType == "ProductDetail") {
      this.commonService.deleteProduct(id).subscribe(data => {
        if (data) {
          this.message = "Record Deleted Successfully!!!";
          this.openSnackBar();
        }
      });
    }
    if (deleteType == "CartDetail") {
      this.commonService.deleteCartDetail(id).subscribe(data => {
        if (data) {
          this.message = "Record Deleted Successfully!!!";
          this.openSnackBar();
        }
      });
    }
  }

  ///**
  //* save data to json file
  //*/
  saveUser() {
    if (this.details.Id === 0) {
      this.commonService.addUser(this.details).subscribe(data => {
        if (data) {
          this.message = "Record Added Successfully!!!";
          this.openSnackBar();
        }
      });
    }
    else {
      this.commonService.updateUser(this.details).subscribe(data => {
        if (data) {
          this.message = "Record Updated Successfully!!!";
          this.openSnackBar();
        }
      });
    }
  }

  ///**
  //* save data to json file
  //*/
  saveProduct() {
    this.details.url = "";
    //this.details.imageName = this.details.imageName === "" ? "" : this.details.imageName;
    if (this.details.Id === 0) {
      this.commonService.addProduct(this.details).subscribe(data => {
        if (data) {
          this.message = "Record Added Successfully!!!";
          this.openSnackBar();
        }
      });
    }
    else {
      this.commonService.updateProduct(this.details).subscribe(data => {
        if (data) {
          this.message = "Record Updated Successfully!!!";
          this.openSnackBar();
        }
      });
    }
  }

  url: any;
  uploadFile(files) {
    if (files.length === 0) {
      return;
    }

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }

    let fileToUpload = <File>files[0];
    let formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.commonService.uploadProductImage(formData).subscribe(data => {
      this.details.imageName = data.toString();
      this.saveProduct();
    });
  }

  removeImage() {
    this.details.ImageName = "";
    this.details.Url = "";
  }


  //selectedFile: File = null;
  //fd = new FormData();


  //createFormData(event) {
  //  this.selectedFile = <File>event.target.files[0];
  //  this.fd.append('file', this.selectedFile, this.selectedFile.name);
  //  debugger
  //}

  //upload() {
  //  this.commonService.uploadProductImage(this.fd).subscribe(data => {
  //    debugger
  //    this.details.ImageName = data.toString();
  //    //this.saveProduct();
  //  });
  //  //this.http.post(url, this.fd)
  //  //  .subscribe(result => {
  //  //    console.log(result)
  //  //  });
  //}

}
