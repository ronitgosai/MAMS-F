import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'app/services/dashboard/product/product.service';
import { DomSanitizer, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private titelService: Title,
    private sanitizer: DomSanitizer
  ) { 
    titelService.setTitle("Product Details | Modern Agrichem")
  }

  productDetails = [];
  pastProductionByProduct = [];
  productSellDetails = [];

  p: number = 1;
  entriesPerPage: any = '10';
  value = 'Clear me';

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
    });
    this.productService.getProductionById(productId).subscribe((production: any) => {
      this.pastProductionByProduct = production.data
    });
    this.productService.getSellById(productId).subscribe((sale: any) => {
      this.productSellDetails = sale.data;
    });
  }

  pagination(event){

  }

}