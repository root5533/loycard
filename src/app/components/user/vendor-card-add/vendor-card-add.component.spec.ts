import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCardAddComponent } from './vendor-card-add.component';

describe('VendorCardAddComponent', () => {
  let component: VendorCardAddComponent;
  let fixture: ComponentFixture<VendorCardAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCardAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCardAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
