import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { Product } from '../product.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  
})
export class ProductListComponent implements OnInit {
  demoProduct: number[] = Array(10).fill(1);
  @Input() numberOfSlides;
  products: Product[] = [];
  singleProduct;
  Category: string = '';
  productId: number;
  isLoading: boolean = true;
  filteredProducts: Product[] = [];
  minPrice: number ;
  maxPrice: number ;

  inShow_All = false;
  qparam: Subscription;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.qparam = this.route.queryParams.subscribe((queryparam: Params) => {
      this.Category = queryparam['Category'];
      this.productId = +queryparam['paramName'];
      
      this.fetchData();
    });
  }

  fetchData() {
    if (this.Category == undefined && !this.productId) {
      
      this.dataService.getAllProducts().subscribe((products) => {
        this.filteredProducts = products.map((product) => {
          product.discount = this.dataService.getRandomDiscount();          
          return product;
        });
        this.products = [...this.filteredProducts];
        
        this.isLoading = false;
      });
    } else if (this.Category) {
      this.dataService
        .getProductsOfCategory(this.Category)
        .subscribe((products) => {
          this.filteredProducts = products.map((product) => {
            product.discount = this.dataService.getRandomDiscount();
            return product;
          });
          this.products = [...this.filteredProducts];
          this.isLoading = false;
        });
    } else if (this.productId) {
      this.dataService.getSingleProduct(this.productId).subscribe((product) => {
        this.singleProduct = product;
        this.singleProduct.discount = this.dataService.getRandomDiscount();
        this.isLoading = false;
      });
    }
  }
  arrayLength = 0;
  
  applyPriceFilter() {
    this.products = this.filteredProducts.filter((product) => {
      return (
        (!this.minPrice || product.price >= this.minPrice) &&
        (!this.maxPrice || product.price <= this.maxPrice)
      );
    });
  }
  ngOnDestroy(): void {
    this.qparam.unsubscribe();
  }
}