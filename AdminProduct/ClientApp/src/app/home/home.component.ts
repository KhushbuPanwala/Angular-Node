import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { ProductDetail } from '../model/product-detail.model';
import { CartDetail } from '../model/cart-detail.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  imageObject: Array<object> = [
    {
      image: 'assets/dart.jfif',
      thumbImage: 'assets/dart.jfif',
    },
    {
      image: 'assets/chess.jfif',
      thumbImage: 'assets/chess.jfif',
    },
    {
      image: 'assets/carrom.jpg',
      thumbImage: 'assets/carrom.jpg',
    },
    {
      image: 'assets/ludo.jfif',
      thumbImage: 'assets/ludo.jfif',
    },
    {
      image: 'assets/sanke ladder.jfif',
      thumbImage: 'assets/sanke ladder.jfif',
    },
    {
      image: 'assets/bowlingpin.jfif',
      thumbImage: 'assets/bowlingpin.jfif',
    },
    {
      image: 'assets/soccer.jfif',
      thumbImage: 'assets/soccer.jfif',
    },
    {
      image: 'assets/snooker.jfif',
      thumbImage: 'assets/snooker.jfif',
    }
  ]

  productDetails: ProductDetail[];

  constructor(private commonService: CommonService, private _snackBar: MatSnackBar) { }

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
    });
  }

  plus(productId) {
    this.productDetails.forEach(product => {
      if (product.Id === productId) {
        if (product.Quantity < 50) {
          ++product.Quantity;
        }
      }
    });
  }

  minus(productId) {
    this.productDetails.forEach(product => {
      if (product.Id === productId) {
        if (product.Quantity > 1) {
          --product.Quantity;
        }
      }
    });
  }

  action: string;
  cartDetail = new CartDetail();
  cartDetails: CartDetail[];

  addCart(productDetail) {
    let userId = localStorage.getItem('loginId');
    this.cartDetail.UserId = Number(userId);
    this.cartDetail.ProductId = productDetail.Id;
    this.cartDetail.ProductName = productDetail.ProductName;
    this.cartDetail.Quantity = productDetail.Quantity;
    this.cartDetail.Price = productDetail.Price * productDetail.Quantity;
    this.commonService.addCartDetail(this.cartDetail).subscribe(data => {
      if (data) {
        this._snackBar.open("Record addded successfully !!!", this.action, {
          duration: 2000,
          panelClass: ['snack-bar']
        });
      }
    });
  }
}
