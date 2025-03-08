import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Rating } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ApiService } from '../../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { AccordionModule } from 'primeng/accordion';
import { InvoicePrintComponent } from "../../Invoice/invoice-print/invoice-print.component";
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
@Component({
  selector: 'app-customer-detailed-list',
  imports: [TableModule, CheckboxModule, AvatarModule, AccordionModule, SelectModule, PanelModule, DialogModule, FormsModule, Tag, ToastModule, CardModule, ButtonModule, CommonModule],
  templateUrl: './customer-detailed-list.component.html',
  styleUrl: './customer-detailed-list.component.scss'
})
export class CustomerDetailedListComponent {

  customer: any;
  customerItems: any[] = [];
  paymentHistory: any[] = [];
  customerId: string = '';
  expandedRows = {};
  isDarkMode: boolean = false;
  display: boolean = false
  customerIDDropdown: any;
  messageService: any;
  Id: any;
  dynamicComponent: any;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.getCustomerDetail();
    this.autopopulatedata();
  }

  getInvoice(id: any) {
    this.display = !this.display
    this.Id = id
  }


  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }
  expandAll() {
    this.expandedRows = this.customer.reduce((acc: any, p: any) => (acc[p.id] = true) && acc, {});
  }

  collapseAll() {
    this.expandedRows = {};
  }

  openInvoiceDialog(invoiceId: any) {
    this.Id = invoiceId; // Set the Id to the invoice ID
    this.dynamicComponent = InvoicePrintComponent; // Set the dynamic component to InvoicePrintComponent
    this.display = true; // Open the dialog
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

  getStatusSeverity(status: string) {
    switch (status) {
      case 'PENDING':
        return 'warn';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'danger';
        break
    }
  }

  autopopulatedata() {
    const autopopulate: any = JSON.parse(sessionStorage.getItem('autopopulate') || '{}');
    if (autopopulate && Array.isArray(autopopulate.customersdrop)) {
      this.customerIDDropdown = [...autopopulate.customersdrop]
    } else {
      this.customerIDDropdown = [];
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'No valid customer data found',
        life: 3000
      });
    }
  }

  getCustomerDetail(): void {
    this.apiService.getCustomerDataWithId(this.customerId).subscribe((res: any) => {
      this.customer = res.data;
      this.customerItems = this.customer.cart?.items || [];
      this.paymentHistory = this.customer.paymentHistory || [];
      this.cdr.markForCheck(); // Trigger change detection to update the view
    },
      (error) => {
        console.error('Error fetching customer data:', error);
      })
  }
}