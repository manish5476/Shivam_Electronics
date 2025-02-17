
import { Component, Inject, Input, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
// import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ApiService } from '../../../../core/services/api.service';
import { Select } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import lodash from 'lodash'
interface DetailedDescription {
  id: string;
  detail: string;
}

interface Dimensions {
  width: string;
  height: string;
  depth: string;
}

interface Location {
  type: 'Point';
  coordinates: string; // Changed to string to handle input
  address?: string;
  description?: string;
  day?: string;
}

interface Image {
  id?: string;
  detail?: string;
  link?: string;
}

interface Meta {
  createdAt: Date;
  updatedAt: Date;
  barcode: string;
  qrCode?: string;
}

interface StartLocation {
  type: 'Point';
  coordinates: string; // Changed to string
  address?: string;
  description?: string;
}

interface Product {
  title: string;
  description: string;
  detailedDescriptions: DetailedDescription[];
  category: string;
  rate: string;
  cgst: string;
  sgst: string;
  price: string;
  discountPercentage?: string;
  ratingAverage?: string;
  ratingQuantity?: string;
  stock: string;
  tags: string[];
  brand: string;
  sku: string;
  weight: string;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  // startLocation: StartLocation;
  // locations: Location[];
  returnPolicy: string;
  minimumOrderQuantity?: string;
  meta: Meta;
  images: Image[]; // Changed to non-optional
  thumbnail: string;
  salesPerson?: any[];
}

@Component({
  selector: 'app-product-master',
  imports: [FloatLabelModule, Select, FormsModule, CommonModule, RouterModule, InputTextModule, TextareaModule, ButtonModule],
  templateUrl: './product-master.component.html',
  styleUrl: './product-master.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ProductMasterComponent {
  darkMode: boolean = false
  isDarkMode: boolean = false;
  darkModes() {
    this.darkMode = !this.darkMode
  }

  product: Product = {
    title: '',
    description: '',
    detailedDescriptions: [{ id: '', detail: '' }],
    category: 'manish',
    rate: '',
    cgst: '9',
    sgst: '9',
    price: '',
    stock: '',
    tags: [],
    brand: '',
    sku: '',
    weight: '',
    dimensions: { width: '', height: '', depth: '' },
    warrantyInformation: '',
    shippingInformation: '',
    availabilityStatus: 'In Stock',
    returnPolicy: '',
    minimumOrderQuantity: '',
    meta: { createdAt: new Date(), updatedAt: new Date(), barcode: '' },
    images: [{ id: '', detail: '', link: '' }], // Initialized
    thumbnail: '',
    salesPerson: [],
  };
  // startLocation: { type: 'Point', coordinates: '' }, // Initialized as string
  // locations: [{ type: 'Point', coordinates: '' }], // Initialized as string
  @Input() redirectedData: any
  public productdata: any
  public productdropdwn: any
  public selectedProductId: any;

  constructor(private apiService: ApiService, private messageService: MessageService, @Inject(PLATFORM_ID) private platformId: Object) { }
  ngOnInit() {
    this.autopopulatedata()
  }
  // toggleDarkMode() {
  //   this.darkMode = !this.darkMode;
  // }

  autopopulatedata() {
    const autopopulate: any = JSON.parse(sessionStorage.getItem('autopopulate') || '{}');
    console.log(autopopulate);

    if (autopopulate && Array.isArray(autopopulate.productsdrop)) {
      this.productdropdwn = lodash.cloneDeep(autopopulate.productsdrop)
      console.log(this.productdropdwn);
    } else {
      this.productdropdwn = [];
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'No valid customer data found',
        life: 3000
      });
    }
  }


  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.redirectedData) this.product = this.redirectedData
  }

  Update() {
    this.apiService.updateProduct(this.selectedProductId, this.product).subscribe((res: any) => {
      // console.log(res);
    })
  }

  autopopulate() {
    if (this.selectedProductId) { // Check if a product ID is selected
      this.apiService.getProductDataWithId(this.selectedProductId).subscribe(
        (res: any) => {
          this.productdata = res;
          this.product = res.data
          //  console.log("populated product", this.product)
        },
        (error) => {
          console.error('Error fetching product data:', error);
          // Handle the error (e.g., display an error message to the user)
        }
      );
    }
  }

  addDetailedDescription() {
    this.product.detailedDescriptions.push({ id: '', detail: '' });
  }

  // addLocation() {
  //   this.product.locations.push({ type: 'Point', coordinates: '' });
  // }

  addImage() {
    this.product.images.push({ id: '', detail: '', link: '' });
  }

  removeImage(index: number) {
    this.product.images.splice(index, 1);
  }

  onSubmit() {
    // console.log(this.product);
    this.apiService.createNewProduct(this.product).subscribe((res: any) => {
      // console.log(res);
    })
  }
}
