import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { APIResponseModel, CartData, Customer, LoginModel } from './model/Product';
import { FormsModule } from '@angular/forms';
import { MasterService } from './service/master.service';
import { Constant } from './constant/constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'bus';

  registerObj: Customer = new Customer();
  loginObj : LoginModel = new LoginModel();

  loggedUserData : Customer = new Customer();
  masterService = inject(MasterService);

  isCartPopupOpen : boolean = false;

  cartData : CartData[] = []


  ngOnInit(): void {
      const isUser = localStorage.getItem(Constant.LOCAL_KEY)

      if(isUser != null){
        const parseObj = JSON.parse(isUser);
        this.loggedUserData = parseObj;
        this.getCartItems();
      }
      this.masterService.onCartAdded.subscribe((res:boolean) => {
        if(res){
          this.getCartItems();
        }
      })
  }

  getCartItems(){
    this.masterService.getCartProductsByCategoryId(this.loggedUserData.custId).subscribe((res:APIResponseModel) => {
      this.cartData = res.data;
    })
  }

  onRemoveProduct(cartId: number){
    this.masterService.deleteProductFromCartById(cartId).subscribe((res: APIResponseModel) => {
      if(res.result){
        alert("Product removed from cart");
        this.getCartItems();
      }
      else{
        alert(res.message)
      }
    })
  }


  showCartPopup(){
    this.isCartPopupOpen = !this.isCartPopupOpen;
  }

  @ViewChild("registerModel") registerModel : ElementRef | undefined;
  openRegisterModel(){
    if(this.registerModel){
      this.registerModel.nativeElement.style.display = "block"
    }
  }

  closeRegisterModel(){
    if(this.registerModel){
      this.registerModel.nativeElement.style.display = "none"
    }
  }

  @ViewChild("loginModel") loginModel : ElementRef | undefined;

  openLoginModel(){
    if(this.loginModel){
      this.loginModel.nativeElement.style.display = "block"
    }
  }

  closeLoginModel(){
    if(this.loginModel){
      this.loginModel.nativeElement.style.display = "none"
    }
  }

  onRegister(){
    this.masterService.registerNewCustomer(this.registerObj).subscribe((res: APIResponseModel) => {
      if(res.result){
        alert("User Registration Success");
        this.closeRegisterModel();
      }
      else{
        alert(res.message)

      }
    })

  }

  onLogin(){
    this.masterService.loginNewCustomer(this.loginObj).subscribe((res: APIResponseModel) => {
      if(res.result){
        this.loggedUserData = res.data;
        localStorage.setItem(Constant.LOCAL_KEY, JSON.stringify(res.data))
        this.closeLoginModel();
      }
      else{
        alert(res.message)

      }
    })

  }

  logoff(){
    localStorage.removeItem(Constant.LOCAL_KEY);
    this.loggedUserData = new Customer();
  }
}
