import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSubscribeComponent } from './vendor-subscribe.component';

describe('VendorSubscribeComponent', () => {
  let component: VendorSubscribeComponent;
  let fixture: ComponentFixture<VendorSubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorSubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
