// import { Component } from '@angular/core';
// import { TableModule } from 'primeng/table';
// import { CommonModule } from '@angular/common';
// import { ButtonModule } from 'primeng/button';
// import { ApiService } from '../../../../core/services/api.service';
// import { FormsModule } from '@angular/forms';
// import { TagModule } from 'primeng/tag';
// import { RatingModule } from 'primeng/rating';
// import { DrawerModule } from 'primeng/drawer';

// @Component({
//     selector: 'app-product-list',
//     imports: [TableModule, CommonModule, ButtonModule, TagModule, RatingModule, FormsModule, DrawerModule],
//     templateUrl: './product-list.component.html',
//     styleUrl: './product-list.component.scss'
// })
// export class ProductListComponent {
//   visible: boolean = false;

// public products: any[]=[];
//     first = 0;
//     rows = 10;

//     constructor(private apiService: ApiService) {}

//     ngOnInit() { this.getProductData()   }
//   getProductData() {
//    this.apiService.getAllProductData().subscribe((res:any)=>{
//     this.products=res.data.doc;
//    })
//   }
//     next() {this.first = this.first + this.rows;}
//     prev() { this.first = this.first - this.rows;}
//     reset() { this.first = 0;    }
//     pageChange(event:any) { this.first = event.first; this.rows = event.rows;    }
//     isLastPage(): boolean {return this.products ? this.first + this.rows >= this.products.length : true;    }
//     isFirstPage(): boolean {return this.products ? this.first === 0 : true;    }

//     getSeverity(status: string) {
//       switch (status) {
//           case 'INSTOCK':
//               return 'success';
//           case 'LOWSTOCK':
//               return 'warn';
//           case 'OUTOFSTOCK':
//               return 'danger';
//           default:
//             return 'success';
//       }
//   }
// }
// import { Product } from '@/domain/product';
// import { ProductService } from '@/service/productservice';
import { ApiService } from '../../../../core/services/api.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
// import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
// import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { ProductMasterComponent } from "../product-master/product-master.component";
interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}
@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
    imports: [TableModule, Dialog, RatingModule, ButtonModule, SelectModule, ToastModule, ToolbarModule, ConfirmDialog, InputTextModule, TextareaModule, CommonModule, FileUpload, Tag, Rating, InputTextModule, FormsModule, IconFieldModule, InputIconModule, ProductMasterComponent],
    providers: [MessageService, ConfirmationService, ApiService],
})
export class ProductListComponent implements OnInit {
    @ViewChild('dt') dt!: Table;
    productDialog: boolean = false;
    products: any[] = [];
    product: any = [];
    selectedProducts: any[] = [];
    submitted: boolean = false;
    statuses: any[] = [];
    cols: Column[] = [];
    exportColumns: ExportColumn[] = [];
    redirectedProduct: any;

    constructor(
        // private productService: ProductService,
        private apiService: ApiService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadDemoData()
        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];
    }

    filterSearch(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.dt.filterGlobal(input.value, 'contains');
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    loadDemoData() {
        const filterOptions = {
            page: 1,        // Pagination: Page number
            limit: 50,       // Pagination: Number of results per page
            sort: 'price,-name',  // Sorting: Sort by price ascending, then name descending
            // fields: 'name,price,category,ratingsAverage', // Field Limiting: Select specific fields
            // category: 'Electronics,Clothing', // Filtering: Products in 'Electronics' OR 'Clothing' categories (using $in operator on backend)
            // ratingsAverage: { gte: '4.5' }, // Filtering: Products with ratingsAverage greater than or equal to 4.5 (using $gte operator on backend)
            // rate: { lt: '100' } // Filtering: Products with price less than 100 (using $lt operator on backend)
        };

        this.apiService.getAllProductData(filterOptions).subscribe(
            (res: any) => {
                if (res && res.data) {
                    this.products = res.data;
                    this.cd.markForCheck();
                }
            },
            (error) => {
                console.error('API Error:', error);
            }
        );
    }

    loadAllData() {
        this.apiService.getAllProductData().subscribe((res: any) => {
            if (res && res.data) {
                this.products = res.data;
                this.cd.markForCheck();
            } else {
                console.error('Error loading all product data: Invalid response format', res);
            }
        }, (error) => {
            console.error('Error loading all product data:', error);
        });


        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: any) {
        this.product = { ...product };
        this.redirectedProduct = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = this.selectedProducts ? this.selectedProducts.map(product => product.id) : []; // Extract IDs
                this.apiService.deleteProduct(ids).subscribe(
                    res => {
                        this.products = this.products.filter(product => !ids.includes(product.id));
                    },
                    err => console.error('Deletion Error:', err)
                );
                this.selectedProducts = [];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter((val) => val.id !== product.id);
                this.product = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'success';
        }
    }
    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }
}