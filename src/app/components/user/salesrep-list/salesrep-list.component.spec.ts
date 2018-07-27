import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesrepListComponent } from './salesrep-list.component';

describe('SalesrepListComponent', () => {
  let component: SalesrepListComponent;
  let fixture: ComponentFixture<SalesrepListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesrepListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesrepListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
