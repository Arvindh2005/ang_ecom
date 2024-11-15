import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { APIResponseModel, CartModel, Customer, LoginModel, OrderModel } from '../model/Product';
import { Constant } from '../constant/constants';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  apiUrl : string = 'https://freeapi.miniprojectideas.com/api/BigBasket/';
  onCartAdded: Subject<boolean> = new Subject<boolean>();
  loggedUserData : Customer = new Customer();

  constructor(private http: HttpClient) {
    const isUser = localStorage.getItem(Constant.LOCAL_KEY);
    if(isUser != null){
      const parseObj = JSON.parse(isUser);
      this.loggedUserData = parseObj;
    }
   }

  getAllProducts() : Observable<APIResponseModel>{
    return this.http.get<APIResponseModel>(this.apiUrl + "GetAllProducts")
  }

  getAllCategory() : Observable<APIResponseModel>{
    return this.http.get<APIResponseModel>(this.apiUrl + "GetAllCategory")
  }

  getAllProductsByCategoryId(categoryId: number) : Observable<APIResponseModel>{
    return this.http.get<APIResponseModel>(this.apiUrl + "GetAllProductsByCategoryId?id="+categoryId)
  }


  registerNewCustomer(obj: Customer) : Observable<APIResponseModel>{
    return this.http.post<APIResponseModel>(this.apiUrl + "RegisterCustomer", obj)
  }

  loginNewCustomer(obj: LoginModel) : Observable<APIResponseModel>{
    return this.http.post<APIResponseModel>(this.apiUrl + "Login", obj)
  }

  addToCart(obj: CartModel) : Observable<APIResponseModel>{
    return this.http.post<APIResponseModel>(this.apiUrl + "AddToCart", obj)
  }

  getCartProductsByCategoryId(loggedUserId : number){
    return this.http.get<APIResponseModel>(this.apiUrl + "GetCartProductsByCustomerId?id="+loggedUserId)
  }

  deleteProductFromCartById(cartId : number){
    return this.http.get<APIResponseModel>(this.apiUrl + "DeleteProductFromCartById?id="+cartId)
  }

  onPlaceOrder(obj: OrderModel) : Observable<APIResponseModel>{
    return this.http.post<APIResponseModel>(this.apiUrl + "PlaceOrder", obj)
  }

}
