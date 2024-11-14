export interface APIResponseModel {
    message: string,
    result: boolean,
    data : any 
}

export interface Category {
    categoryId: number
    categoryName: string
    parentCategoryId: number
    userId: number
  }

export interface ProductList {
    productId: number
    productSku: string
    productName: string
    productPrice: number
    productShortName: string
    productDescription: string
    createdDate: string
    deliveryTimeSpan: string
    categoryId: number
    productImageUrl: string
    categoryName: string
  }