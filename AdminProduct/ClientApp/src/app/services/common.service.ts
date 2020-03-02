import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { UserDetail } from '../model/user-detail.model';
//import { ProductDetail } from '../model/product-detail.model';
//import { CartDetail } from '../model/cart-detail.model';

@Injectable()
export class CommonService {


  baseUrl: string = "http://localhost:8000/";

  public uploadProdutcImageUrl = "/api/UploadImage/UploadProductImage";

  constructor(public http: HttpClient) { }

  headers = new HttpHeaders()
    .set('Authorization', 'my-auth-token')
    .set('Content-Type', 'application/json');


  authenticateUser(userDetail: any) {
    return this.http.post<any>(this.baseUrl + "authenticateUser", JSON.stringify(userDetail), { headers: this.headers });
  }

  //User Detail
  getUserDetails() {
    return this.http.get<any>(this.baseUrl + 'user');
  }

  getUserDetailById(userId: number) {
    return this.http.get<any>(this.baseUrl + 'userById?id=' + userId);
  }

  addUser(userDetail: any) {
    return this.http.post(this.baseUrl + "saveUser", JSON.stringify(userDetail), { headers: this.headers });
  }

  updateUser(userDetail: any) {
    return this.http.put(this.baseUrl + "updateUser", JSON.stringify(userDetail), { headers: this.headers });
  }

  deleteUser(userId: number) {
    return this.http.delete(this.baseUrl + 'deleteUser?id=' + userId);
  }

  //Product Detail
  getAllProductDetails() {
    return this.http.get<any>(this.baseUrl + "products");
  }

  getProductDetailById(productId: number) {
    return this.http.get<any>(this.baseUrl + 'productsById?id=' + productId);
  }

  addProduct(productDetail: any) {
    return this.http.post(this.baseUrl + "saveProduct", JSON.stringify(productDetail), { headers: this.headers });
  }

  updateProduct(productDetail: any) {
    return this.http.put(this.baseUrl + "updateProduct", JSON.stringify(productDetail), { headers: this.headers });
  }

  deleteProduct(productId: number) {
    return this.http.delete(this.baseUrl + 'deleteProduct?id=' + productId);
  }

  uploadProductImage(uploadData) {
    //let headers2 = new HttpHeaders()
    //  .set('Authorization', 'my-auth-token')
    //  .set('Content-Type', 'multipart/form-data');
    //return this.http.post(this.baseUrl + "fileupload", uploadData, { headers: headers2 });

    //return this.http.post(this.baseUrl + "fileupload", uploadData, { headers: headers2 });
    return this.http.post(this.uploadProdutcImageUrl, uploadData);
  }

  //cart Detail
  getCartDetail(userId: number) {
    return this.http.get<any>(this.baseUrl + "cartDetails?id=" + userId);
  }

  addCartDetail(cartDetail: any) {
    return this.http.post(this.baseUrl + "addTocart", JSON.stringify(cartDetail), { headers: this.headers });
  }

  //updateCartDetail(cartDetail: CartDetail) {
  //  return this.http.post<any>(this.updateCartDetailUrl, cartDetail);
  //}

  deleteCartDetail(cartId: number) {
    return this.http.delete(this.baseUrl + 'deleteCart?id=' + cartId);
  }
}

