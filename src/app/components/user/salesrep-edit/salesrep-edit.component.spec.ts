import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesrepEditComponent } from './salesrep-edit.component';

describe('SalesrepEditComponent', () => {
  let component: SalesrepEditComponent;
  let fixture: ComponentFixture<SalesrepEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesrepEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesrepEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
