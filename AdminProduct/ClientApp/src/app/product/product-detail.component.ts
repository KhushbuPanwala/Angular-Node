import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../services/common.service';
import { ProductDetail } from '../model/product-detail.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../common/dialog.component';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html'
})

export class ProductDetailComponent implements OnInit {

  productDetails: ProductDetail[];
  productData = new ProductDetail();
  productId: number;
  dialogTitle = "";

  displayedColumns: string[] = ['image', 'productCode', 'productName', 'category', 'price', 'action'];

  dataSource: MatTableDataSource<ProductDetail>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private commonService: CommonService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getProducts();
  }

  /**
   *get user details  
   */
  getProducts() {
    this.commonService.getAllProductDetails().subscribe(data => {
      this.productDetails = data;
      this.productDetails.forEach(product => {
        product.Url = product.ImageName !== "" ? "./assets/productImage/" + product.ImageName : "";
      });

      this.dataSource = new MatTableDataSource(this.productDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  /**
   * add Product
   * @param id: product id
   */
  addProduct() {
    this.productData = new ProductDetail();
    this.productData.Id = 0;
    this.productData.Url = "";
    this.productData.Category = "Indor Games";
    //this.productData.url = "./assets/upload_img.jpg";
    this.dialogTitle = "Add Product";

    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: this.dialogTitle, type: 'ProductDetail', details: this.productData },
      panelClass: 'edit-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProducts();
    });
  }

  /**
   * edit Product
   * @param id: product id
   */
  editProduct(productId: number) {
    this.productData = new ProductDetail();
    this.dialogTitle = "Edit Product";
    this.commonService.getProductDetailById(productId).subscribe(data => {
      this.productData = data[0];
      this.productData.Url = this.productData.ImageName !== "" ? "./assets/productImage/" + this.productData.ImageName : "";
      //this.productData.url = "./assets/" + this.productData.imageName;

      const dialogRef = this.dialog.open(DialogComponent, {
        data: { title: this.dialogTitle, type: 'ProductDetail', details: this.productData },
        panelClass: 'edit-dialog'
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getProducts();
      });
    });
  }


  /**
   * Delete Product 
   * @param id: product id
   */
  deleteProduct(productId: number) {
    this.dialogTitle = "Delete Product";
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: this.dialogTitle, type: 'DeleteConfirmation', id: productId,
        deleteType: "ProductDetail"
      },
      panelClass: 'delete-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProducts();
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
