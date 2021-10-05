import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'app/services/dashboard/product/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService
  ) { }

  productDetails = [];

  ngOnInit(): void {
    this.getProductDetails();
  }

  getProductDetails(){
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    let productId = {
      product_id: id
    }
    this.productService.getProductById(productId).subscribe((product: any) => {
      this.productDetails = product.data;
      console.log(this.productDetails);
    })
  }

}