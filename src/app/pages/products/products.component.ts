import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { APIResponseModel, CartModel, Category, Customer, ProductList } from '../../model/Product';
import { map, Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Constant } from '../../constant/constants';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy{

  masterService = inject(MasterService);
  //productList: ProductList[] = [];
  productList = signal<ProductList[]>([]);

  categoryList$ : Observable<Category[]> = new Observable<Category[]>();

  subscriptionList: Subscription[] = [];

  loggedUserData : Customer = new Customer();

  constructor(){
    const isUser = localStorage.getItem(Constant.LOCAL_KEY)
    if(isUser != null){
      const parseObj = JSON.parse(isUser);
      this.loggedUserData = parseObj;
    }
  }

  ngOnInit(): void {

    this.loadAllProducts();
    this.categoryList$ = this.masterService.getAllCategory().pipe(
      map(item => item.data)
    )
      
  }

  getProductsByCategory(id:number){
    this.masterService.getAllProductsByCategoryId(id).subscribe((res:APIResponseModel) => {
      this.productList.set(res.data);
    })
  }

  loadAllProducts(){
    this.subscriptionList.push(
      this.masterService.getAllProducts().subscribe((res: APIResponseModel) => {
        this.productList.set(res.data);
      })
    )
  }

  onAddToCart(id  : number){

    const newObj : CartModel = new CartModel();
    newObj.ProductId = id;
    newObj.custId = this.loggedUserData.custId;



    this.masterService.addToCart(newObj).subscribe((res: APIResponseModel) => {
      console.log(res);
      if(res.result){
        alert("Product added to cart");
        this.masterService.onCartAdded.next(true);
      }else{
        alert(res.message);
      }
    })

  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(element => {
      element.unsubscribe();
    });
      
  }

}
