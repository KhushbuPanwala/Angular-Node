import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../services/common.service';
import { CartDetail } from '../model/Cart-detail.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../common/dialog.component';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-Cart-detail',
  templateUrl: './Cart-detail.component.html'
})

export class CartDetailComponent implements OnInit {

  constructor(private commonService: CommonService, private dialog: MatDialog) { }

  cartDetails: CartDetail[];
  cartId: number;
  dialogTitle = "";

  displayedColumns: string[] = ['productName', 'quantity', 'price', 'action'];

  dataSource: MatTableDataSource<CartDetail>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  ngOnInit() {
    this.getCartDetail();
  }

  /**
   *get user details  
   */
  totalCost: number;
  getCartDetail() {

    let userId = localStorage.getItem('loginId');

    this.totalCost = 0;
    this.commonService.getCartDetail(Number(userId)).subscribe(data => {
      this.cartDetails = data;
      this.cartDetails.forEach(cartItem => {
        this.totalCost = Number(cartItem.Price) + this.totalCost;
      });

      this.dataSource = new MatTableDataSource(this.cartDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
  }

  /**
   * Delete Cart 
   * @param id: Cart id
   */
  deleteCart(cartId: number) {
    this.dialogTitle = "Delete Cart";
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: this.dialogTitle, type: 'DeleteConfirmation', id: cartId,
        deleteType: "CartDetail"
      },
      panelClass: 'delete-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getCartDetail();
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
