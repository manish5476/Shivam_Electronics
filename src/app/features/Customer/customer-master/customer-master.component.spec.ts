import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMasterComponent } from './customer-master.component';

describe('CustomerMasterComponent', () => {
  let component: CustomerMasterComponent;
  let fixture: ComponentFixture<CustomerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
