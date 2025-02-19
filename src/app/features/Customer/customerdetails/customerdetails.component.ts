import { Component, HostBinding } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service'; // Imported class
import { SelectModule } from 'primeng/select';
import { TabViewModule } from 'primeng/tabview';
import { PrimeIcons } from 'primeng/api';
import * as lodash from 'lodash';

@Component({
  selector: 'app-customerdetails',
  standalone: true,
  imports: [CardModule, SelectModule, TableModule, TabViewModule, CommonModule, FormsModule],
  templateUrl: './customerdetails.component.html',
  styleUrl: './customerdetails.component.scss',
  providers: [PrimeIcons],
})
export class CustomerdetailsComponent {
  @HostBinding('class.dark') darkMode = false;

  customerId!: string;
  customerIDDropdown: any[] = [];
  customer: any = null;
  products: any[] = [];
  activeTabIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService, // Injected class
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.autopopulatedata();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.customerId = params['id'];
        this.fetchCustomerData();
      }
    });
  }

  autopopulatedata() {
    const autopopulate: any = JSON.parse(sessionStorage.getItem('autopopulate') || '{}');
    if (autopopulate && Array.isArray(autopopulate.customersdrop)) {
      this.customerIDDropdown = lodash.cloneDeep(autopopulate.customersdrop);
    } else {
      this.customerIDDropdown = [];
      console.warn('No valid customer dropdown data found');
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  onTabChange(index: number) {
    this.activeTabIndex = index;
  }

  fetchCustomerData() {
    this.apiService.getCustomerDataWithId(this.customerId).subscribe(
      (response: any) => {
        this.customer = response.data;
        console.log('Customer Data:', this.customer);
        this.fetchProductDetails();
      },
      (error: any) => {
        console.error('Error fetching customer data:', error);
      }
    );
  }

  fetchProductDetails() {
    const productIds = this.customer.cart.items.map((item: any) => item.productId);
    if (productIds.length > 0) {
      this.apiService.getProductDataWithId(productIds).subscribe(
        (response: any) => {
          this.products = response.data;
          console.log('Product Details:', this.products);
        },
        (error: any) => {
          console.error('Error fetching product details:', error);
        }
      );
    }
  }
}

// Define the interface with a different name
interface ApiServiceInterface {
  getCustomerDataWithId(id: string): any;
  getProductsByIds(ids: string[]): any;
}
// import { Component, HostBinding, Input } from '@angular/core';
// import { CardModule } from 'primeng/card';
// import { TableModule } from 'primeng/table';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { ApiService } from '../../../core/services/api.service';
// import { SelectModule } from 'primeng/select';
// import { TabViewModule } from 'primeng/tabview';
// import { PrimeIcons } from 'primeng/api';
// import lodash from 'lodash'
// @Component({
//   selector: 'app-customerdetails',
//   imports: [CardModule, SelectModule, TableModule, TabViewModule, CommonModule, FormsModule],
//   templateUrl: './customerdetails.component.html',
//   styleUrl: './customerdetails.component.scss',
//   providers: [PrimeIcons] // Add PrimeIcons to providers if needed for component-level injection


// })
// export class CustomerdetailsComponent {
//   customerId!: string;
//   customerIDDropdown: any;
//   messageService: any;
//   selectedGuaranteer: any = ''

//   @HostBinding('class.dark') darkMode = false;
//   // @Input() customer: any; // Input to receive customer data
//   activeTabIndex: number = 0; // For TabView
//   toggleDarkMode() {
//     this.darkMode = !this.darkMode;
//   }

//   constructor(private route: ActivatedRoute, private apiService: ApiService, private http: HttpClient) { }
//   ngOnInit(): void {
//     this.autopopulatedata()
//   }
//   autopopulatedata() {
//     const autopopulate: any = JSON.parse(sessionStorage.getItem('autopopulate') || '{}');
//     console.log(autopopulate);
//     if (autopopulate && Array.isArray(autopopulate.customersdrop)) {
//       this.customerIDDropdown = lodash.cloneDeep(autopopulate.customersdrop)
//       console.log(this.customerIDDropdown);
//     } else {
//       this.customerIDDropdown = [];
//       this.messageService.add({
//         severity: 'info',
//         summary: 'Info',
//         detail: 'No valid customer data found',
//         life: 3000
//       });
//     }
//   }


//   onTabChange(index: number) {
//     this.activeTabIndex = index;
//   }

//   public customer: any

//   data: any = {
//     _id: "678cc6e2ac1c4d9126b458ef",
//     status: "inactive",
//     profileImg: "",
//     email: "msms5476m@gmail.com",
//     fullname: "Manish Singh",
//     phoneNumbers: [
//       { number: "7160966299", type: "home", primary: false }
//     ],
//     addresses: [
//       { street: "69 balaji green city near noorie media", city: "surat", state: "GUJARAT", zipCode: "394327", country: "India", type: "home" }
//     ],
//     guaranteerId: "6787cc8facb090dbb35b773a",
//     totalPurchasedAmount: 0,
//     remainingAmount: 0,
//     cart: { items: [] },
//     paymentHistory: [],
//     createdAt: "2025-01-19T09:33:22.830Z",
//     updatedAt: "2025-02-06T17:24:24.643Z"
//   };


//   fetchCustomerData() {
//     this.apiService.getCustomerDataWithId(this.customerId).subscribe(
//       (response) => {
//         this.customer = response.data;
//         console.log(this.customer)
//       },
//       (error) => {
//         console.error('Error fetching customer data:', error);
//       }
//     );
//   }
// }