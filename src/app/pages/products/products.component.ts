import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { APIResponseModel, Category, ProductList } from '../../model/Product';
import { map, Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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

  ngOnDestroy(): void {
    this.subscriptionList.forEach(element => {
      element.unsubscribe();
    });
      
  }

}
