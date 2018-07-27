import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesrepVendorListDownloadComponent } from './salesrep-vendor-list-download.component';

describe('SalesrepVendorListDownloadComponent', () => {
  let component: SalesrepVendorListDownloadComponent;
  let fixture: ComponentFixture<SalesrepVendorListDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesrepVendorListDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesrepVendorListDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
