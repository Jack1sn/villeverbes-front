import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudAdminsComponent } from './crud-admins.component';

describe('CrudAdminsComponent', () => {
  let component: CrudAdminsComponent;
  let fixture: ComponentFixture<CrudAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudAdminsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
