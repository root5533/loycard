import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesrepAddComponent } from './salesrep-add.component';

describe('SalesrepAddComponent', () => {
  let component: SalesrepAddComponent;
  let fixture: ComponentFixture<SalesrepAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesrepAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesrepAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
