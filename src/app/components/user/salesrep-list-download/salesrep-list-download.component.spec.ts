import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesrepListDownloadComponent } from './salesrep-list-download.component';

describe('SalesrepListDownloadComponent', () => {
  let component: SalesrepListDownloadComponent;
  let fixture: ComponentFixture<SalesrepListDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesrepListDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesrepListDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
