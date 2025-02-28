

// import { IftaLabelModule } from 'primeng/iftalabel';
// import { ButtonModule } from 'primeng/button';
// import { RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { ApiService } from '../../../core/services/api.service';
// import { Component, Inject, OnInit, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
// import { CardModule } from 'primeng/card';
// import { SelectModule } from 'primeng/select';
// import { FileUploadModule } from 'primeng/fileupload';
// import { ImageModule } from 'primeng/image';
// import { InputTextModule } from 'primeng/inputtext';
// import { TableModule } from 'primeng/table';
// import { RadioButtonModule } from 'primeng/radiobutton';
// import { KeyFilterModule } from 'primeng/keyfilter';
// import { DialogModule } from 'primeng/dialog';
// import { TagModule } from 'primeng/tag';
// import { ConfirmationService, MessageService } from 'primeng/api';
// import { HttpClient } from '@angular/common/http';
// import { FileUpload } from 'primeng/fileupload';
// import { FocusTrapModule } from 'primeng/focustrap';// import { SupabaseService } from '../../../core/services/supabase.service';
// import lodash from 'lodash'

// interface Customer {
//   fullname: string;
//   profileImg: string;
//   email: string;
//   status: string;
//   phoneNumbers: Phone[];
//   addresses: Address[];
//   cart: { items: any[] };
//   guaranteerId: string;
//   totalPurchasedAmount: number;
//   remainingAmount: number;
//   paymentHistory: any[];
//   metadata: any;
// }

// interface Phone {
//   number: string;
//   type: string;
//   primary: boolean;
// }

// interface Address {
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
//   type: string;
//   isDefault: boolean;
// }

// interface DropdownOption {
//   label: string;
//   value: any;
// }
// interface CustomerDropdownOption {
//   fullname: string;
//   _id: any;
//   phoneNumbers: Phone[];
// }

// @Component({
//   selector: 'app-customer-master',
//   templateUrl: './customer-master.component.html',
//   styleUrls: ['./customer-master.component.scss'],
//   imports: [CardModule, RouterModule, FocusTrapModule, FormsModule, CommonModule, TagModule, DialogModule, KeyFilterModule, TableModule, RadioButtonModule, InputTextModule, ButtonModule, SelectModule, FileUploadModule, ImageModule,],
//   providers: [ApiService, IftaLabelModule, ConfirmationService, MessageService],
// })

// export class CustomerMasterComponent implements OnInit {
//   selectedFile: File | null = null;
//   imageUrl: string | null = null;
//   bucketName = 'manish';
//   phoneDialogVisible = false;
//   addressDialogVisible = false;
//   newPhoneNumber: Phone = { number: '', type: 'mobile', primary: false };
//   newAddress: Address = { street: '', city: '', state: '', zipCode: '', country: '', type: 'home', isDefault: false };
//   customerId: string = '12345'; // You should dynamically get this from your application (e.g., logged-in user's customer ID)
//   uploadStatus: string = ''; // For showing the status of the upload
//   customerIDDropdown: CustomerDropdownOption[] = [];
//   selectedGuaranter: CustomerDropdownOption | any = {};
//   isDarkMode: boolean = false;

//   statuses: DropdownOption[] = [
//     { label: 'Active', value: 'active' },
//     { label: 'Inactive', value: 'inactive' },
//     { label: 'Pending', value: 'pending' },
//     { label: 'Suspended', value: 'suspended' },
//     { label: 'Blocked', value: 'blocked' },
//   ];

//   phoneTypes: DropdownOption[] = [
//     { label: 'Home', value: 'home' },
//     { label: 'Mobile', value: 'mobile' },
//     { label: 'Work', value: 'work' },
//   ];

//   addressTypes: DropdownOption[] = [
//     { label: 'Billing', value: 'billing' },
//     { label: 'Shipping', value: 'shipping' },
//     { label: 'Home', value: 'home' },
//     { label: 'Work', value: 'work' }
//   ];


//   customer: Customer = {
//     fullname: '',
//     profileImg: '',
//     email: '',
//     status: '',
//     phoneNumbers: [],
//     addresses: [],
//     cart: { items: [] },
//     guaranteerId: this.selectedGuaranter._id,
//     totalPurchasedAmount: 0,
//     remainingAmount: 0,
//     paymentHistory: [],
//     metadata: {},
//   };

//   @ViewChild('fileUploader') fileUploader!: FileUpload;


//   constructor(
//     // private supabase: SupabaseService,
//     private ApiService: ApiService,
//     private http: HttpClient,
//     private messageService: MessageService,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {
//     this.isDarkMode = (isPlatformBrowser(this.platformId)) && localStorage.getItem('darkMode') === 'true';
//     if (this.isDarkMode) {
//       document.body.classList.add('dark-mode');
//     }
//   }

//   ngOnInit() {
//     this.autopopulatedata()
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     this.autopopulatedata();
//   }

//   autopopulatedata() {
//     const autopopulate: any = JSON.parse(sessionStorage.getItem('autopopulate') || '{}');

//     if (autopopulate && Array.isArray(autopopulate.customersdrop)) {
//       this.customerIDDropdown = lodash.cloneDeep(autopopulate.customersdrop)
//     } else {
//       this.customerIDDropdown = [];
//       this.messageService.add({
//         severity: 'info',
//         summary: 'Info',
//         detail: 'No valid customer data found',
//         life: 3000
//       });
//     }

//     // Ensure future updates also enforce an array
//     setTimeout(() => {
//       if (!Array.isArray(this.customerIDDropdown)) {
//         console.error('Corrupted Dropdown Data. Resetting...');
//         this.customerIDDropdown = [];
//       }
//     }, 500);

//   }

//   selectedGuaranterevent(event: any) {
//     this.selectedGuaranter = event.value;
//   }

//   toggleDarkMode() {
//     this.isDarkMode = !this.isDarkMode;
//     document.body.classList.toggle('dark-mode', this.isDarkMode);
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.setItem('darkMode', String(this.isDarkMode));
//     }
//   }

//   // onFileSelected(event: any) {
//   //   this.selectedFile = event.target.files[0] as File;
//   // }

//   getCustomerID() {
//     const customerId = 'your-customer-id';
//     this.ApiService.getCustomerDataWithId(customerId)
//       .subscribe({
//         next: (customer) => {
//           this.customer = customer;
//         },
//         error: (err) => {
//           console.error('Error fetching customer:', err);
//           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load customer data.' });
//         }
//       });
//   }


//   handleFileSelect(event?: any) {
//     const file = event.files[0];
//     if (file) {
//       this.uploadStatus = 'Preparing to upload...';
//       const formData = new FormData();
//       formData.append('image', file); // Append the selected file to FormData
//       // this.ApiService.uploadProfileImage(formData, this.customerId).subscribe(
//       //   (response: any) => {
//       //     this.uploadStatus = 'Image uploaded successfully!';
//       //   },
//       //   (error: any) => {
//       //     this.uploadStatus = 'Error uploading image.';
//       //     console.error('Upload Error:', error);
//       //   }
//       // );
//     } else {
//     }
//   }

//   handleFileUpload(event: any) {
//   }



//   saveCustomer() {
//     if (this.validateCustomer()) {
//       this.customer.guaranteerId = this.selectedGuaranter._id
//       this.ApiService.createNewCustomer(this.customer).subscribe(
//         (response: any) => {
//           const customerId = response.data._id;
//           this.customerId = customerId;
//           // this.handleFileSelect();
//         },
//         (error) => {
//           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create customer.' });
//         }
//       );
//     } else {
//       this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please correct the errors in the form.' });
//     }
//   }


//   validateCustomer(): boolean {
//     // Basic validation checks
//     if (!this.customer.fullname) {
//       this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Fullname is required.' });
//       return false;
//     }

//     if (!this.customer.email || !this.customer.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
//       this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please enter a valid email address.' });
//       return false;
//     }

//     return true;
//   }

//   showPhoneDialog() {
//     this.phoneDialogVisible = true;
//   }
//   showAddressDialog() {
//     this.addressDialogVisible = true
//   }

//   addPhoneNumber() {
//     if (this.newPhoneNumber.number && this.newPhoneNumber.type) {
//       this.customer.phoneNumbers.push(this.newPhoneNumber);
//       this.phoneDialogVisible = false;
//       this.newPhoneNumber = { number: '', type: 'mobile', primary: false };
//     } else {
//       this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please enter phone number and type.' });
//     }
//   }

//   deletePhone(index: number) {
//     this.customer.phoneNumbers.splice(index, 1);
//   }

//   addAddress() {
//     this.addressDialogVisible = true
//     if (this.newAddress.street && this.newAddress.city) {
//       this.customer.addresses.push({ ...this.newAddress });
//       this.addressDialogVisible = false;
//       this.newAddress = { street: '', city: '', state: '', zipCode: '', country: '', type: 'home', isDefault: false };
//     }
//   }

//   setDefaultAddress(index: number) {
//     this.customer.addresses.forEach((address: { isDefault: boolean; }, i: any) => address.isDefault = i === index);
//   }

//   removeAddress(index: number) {
//     this.customer.addresses.splice(index, 1);
//   }
// }
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
import { FocusTrapModule } from 'primeng/focustrap';// import { SupabaseService } from '../../../core/services/supabase.service';
import lodash from 'lodash'

interface Customer {
  fullname: string;
  profileImg: string;
  email: string;
  status: string;
  phoneNumbers: Phone[];
  addresses: Address[];
  cart: { items: any[] };
  guaranteerId: string;
  totalPurchasedAmount: number;
  remainingAmount: number;
  paymentHistory: any[];
  metadata: any;
}

interface Phone {
  number: string;
  type: string;
  primary: boolean;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: string;
  isDefault: boolean;
}

interface DropdownOption {
  label: string;
  value: any;
}
interface CustomerDropdownOption {
  fullname: string;
  _id: any;
  phoneNumbers: Phone[];
}

@Component({
  selector: 'app-customer-master',
  templateUrl: './customer-master.component.html',
  styleUrls: ['./customer-master.component.scss'],
  imports: [ReactiveFormsModule, CardModule, RouterModule, FocusTrapModule, FormsModule, CommonModule, TagModule, DialogModule, KeyFilterModule, TableModule, RadioButtonModule, InputTextModule, ButtonModule, SelectModule, FileUploadModule, ImageModule,],
  providers: [ApiService, IftaLabelModule, ConfirmationService, MessageService],
})

export class CustomerMasterComponent implements OnInit {
  @ViewChild('fileUploader') fileUploader!: FileUpload;
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  bucketName = 'manish';
  phoneDialogVisible = false;
  addressDialogVisible = false;
  newPhoneNumberForm: FormGroup;
  newAddressForm: FormGroup;
  customerId: string = '12345'; // You should dynamically get this from your application (e.g., logged-in user's customer ID)
  uploadStatus: string = ''; // For showing the status of the upload
  customerIDDropdown: CustomerDropdownOption[] = [];
  selectedGuaranter: CustomerDropdownOption | any = {};
  isDarkMode: boolean = false;
  customerForm: FormGroup;

  statuses: DropdownOption[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
    { label: 'Suspended', value: 'suspended' },
    { label: 'Blocked', value: 'blocked' },
  ];

  phoneTypes: DropdownOption[] = [
    { label: 'Home', value: 'home' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Work', value: 'work' },
  ];

  addressTypes: DropdownOption[] = [
    { label: 'Billing', value: 'billing' },
    { label: 'Shipping', value: 'shipping' },
    { label: 'Home', value: 'home' },
    { label: 'Work', value: 'work' }
  ];


  customer: Customer = {
    fullname: '',
    profileImg: '',
    email: '',
    status: 'active',
    phoneNumbers: [],
    addresses: [],
    cart: { items: [] },
    guaranteerId: '', // Initialize as empty string
    totalPurchasedAmount: 0,
    remainingAmount: 0,
    paymentHistory: [],
    metadata: {},
  };



  constructor(
    private ApiService: ApiService,
    private http: HttpClient,
    private messageService: MessageService,
    private fb: FormBuilder, private cdRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isDarkMode = (isPlatformBrowser(this.platformId)) && localStorage.getItem('darkMode') === 'true';
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }

    this.customerForm = this.fb.group({
      fullname: ['', Validators.required],
      profileImg: [''],
      email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required],
      phoneNumbers: this.fb.array([]), // Initialize as empty FormArray
      addresses: this.fb.array([]),    // Initialize as empty FormArray
      guaranteerId: [''],
      totalPurchasedAmount: [0],
      remainingAmount: [0],
      paymentHistory: this.fb.array([]),
      metadata: this.fb.group({})
    });
    this.newPhoneNumberForm = this.fb.group({
      number: ['', Validators.required],
      type: ['mobile', Validators.required],
      primary: [false]
    });

    this.newAddressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      type: ['home', Validators.required],
      isDefault: [false]
    });
  }

  ngOnInit() {
    this.autopopulatedata();
    this.cdRef.detectChanges();

    this.populateFormWithCustomerData(); // Populate form after data is available
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.autopopulatedata();
    this.populateFormWithCustomerData(); // Re-populate form on changes
  }

  populateFormWithCustomerData() {
    // Patch value to form, including nested FormArrays
    this.customerForm.patchValue({
      fullname: this.customer.fullname,
      profileImg: this.customer.profileImg,
      email: this.customer.email,
      status: this.customer.status,
      guaranteerId: this.customer.guaranteerId,
      totalPurchasedAmount: this.customer.totalPurchasedAmount,
      remainingAmount: this.customer.remainingAmount,
      metadata: this.customer.metadata,
    });
    this.setPhoneNumbers(this.customer.phoneNumbers);

    // Set addresses FormArray
    this.setAddresses(this.customer.addresses);
  }


  setPhoneNumbers(phones: Phone[]) {
    const phoneFormArray = this.customerForm.get('phoneNumbers') as FormArray;
    phoneFormArray.clear(); // Clear existing form array
    phones.forEach(phone => {
      phoneFormArray.push(this.fb.group({
        number: [phone.number, Validators.required],
        type: [phone.type, Validators.required],
        primary: [phone.primary]
      }));
    });
  }

  setAddresses(addresses: Address[]) {
    const addressFormArray = this.customerForm.get('addresses') as FormArray;
    addressFormArray.clear(); // Clear existing form array
    addresses.forEach(address => {
      addressFormArray.push(this.fb.group({
        street: [address.street, Validators.required],
        city: [address.city, Validators.required],
        state: [address.state, Validators.required],
        zipCode: [address.zipCode, Validators.required],
        country: [address.country, Validators.required],
        type: [address.type, Validators.required],
        isDefault: [address.isDefault]
      }));
    });
  }


  get phoneNumbersFormArray() {
    return this.customerForm.get('phoneNumbers') as FormArray;
  }

  get addressesFormArray() {
    return this.customerForm.get('addresses') as FormArray;
  }



  autopopulatedata() {
    const autopopulate: any = JSON.parse(sessionStorage.getItem('autopopulate') || '{}');
    if (autopopulate && Array.isArray(autopopulate.customersdrop)) {
      this.customerIDDropdown = lodash.cloneDeep(autopopulate.customersdrop)
    } else {
      this.customerIDDropdown = [];
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'No valid customer data found',
        life: 3000
      });
    }

    // Ensure future updates also enforce an array
    setTimeout(() => {
      if (!Array.isArray(this.customerIDDropdown)) {
        console.error('Corrupted Dropdown Data. Resetting...');
        this.customerIDDropdown = [];
      }
    }, 500);

  }

  selectedGuaranterevent(event: any) {
    this.selectedGuaranter = event.value;
    this.customerForm.patchValue({ guaranteerId: this.selectedGuaranter._id });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkMode', String(this.isDarkMode));
    }
  }


  getCustomerID() {
    const customerId = 'your-customer-id';
    this.ApiService.getCustomerDataWithId(customerId)
      .subscribe({
        next: (customer) => {
          this.customer = customer;
          this.populateFormWithCustomerData(); // Populate form on data fetch
        },
        error: (err) => {
          console.error('Error fetching customer:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load customer data.' });
        }
      });
  }


  handleFileSelect(event?: any) {
    const file = event.files[0];
    if (file) {
      this.uploadStatus = 'Preparing to upload...';
      const formData = new FormData();
      formData.append('image', file); // Append the selected file to FormData
      // this.ApiService.uploadProfileImage(formData, this.customerId).subscribe(
      //   (response: any) => {
      //     this.uploadStatus = 'Image uploaded successfully!';
      //   },
      //   (error: any) => {
      //     this.uploadStatus = 'Error uploading image.';
      //     console.error('Upload Error:', error);
      //   }
      // );
    } else {
    }
  }

  handleFileUpload(event: any) {
  }

  saveCustomer() {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;
      formValue.guaranteerId = this.selectedGuaranter._id; // Ensure guaranteerId is included

      this.ApiService.createNewCustomer(formValue).subscribe(
        (response: any) => {
          const customerId = response.data._id;
          this.customerId = customerId;
          // this.handleFileSelect();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer saved successfully.' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create customer.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please correct the errors in the form.' });
      // Optionally, trigger form validation to show errors
      Object.keys(this.customerForm.controls).forEach(field => {
        const control = this.customerForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }


  showPhoneDialog() {
    this.newPhoneNumberForm.reset(); // Reset form when dialog is opened
    this.phoneDialogVisible = true;
  }
  showAddressDialog() {
    this.newAddressForm.reset(); // Reset form when dialog is opened
    this.addressDialogVisible = true
  }

  addPhoneNumber() {
    if (this.newPhoneNumberForm.valid) {
      const phoneFormArray = this.customerForm.get('phoneNumbers') as FormArray;
      phoneFormArray.push(this.fb.group(this.newPhoneNumberForm.value));
      this.newPhoneNumberForm.reset({ type: 'mobile', primary: false }); // Reset with defaults
      this.phoneDialogVisible = true;
    } else {
      // Trigger validation to show errors in dialog
      Object.keys(this.newPhoneNumberForm.controls).forEach(field => {
        const control = this.newPhoneNumberForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please enter valid phone details.' });
    }
  }
  editPhone(i: any) {

  }

  deletePhone(index: number) {
    this.phoneNumbersFormArray.removeAt(index);
  }

  addAddress() {
    if (this.newAddressForm.valid) {
      const addressFormArray = this.customerForm.get('addresses') as FormArray;
      addressFormArray.push(this.fb.group(this.newAddressForm.value));
      this.addressDialogVisible = false;
      this.newAddressForm.reset({ type: 'home', isDefault: false }); // Reset with defaults
    } else {
      // Trigger validation to show errors in dialog
      Object.keys(this.newAddressForm.controls).forEach(field => {
        const control = this.newAddressForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please enter valid address details.' });
    }
  }


  ngAfterViewInit(): void {
    this.cdRef.detectChanges(); // Force change detection after view init
  }

  removeAddress(index: number) {
    this.addressesFormArray.removeAt(index);
  }
}