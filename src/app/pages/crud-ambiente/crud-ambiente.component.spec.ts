import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  CrudAmbienteComponent } from './crud-ambiente.component';

describe('CrudAmbienteComponent', () => {
  let component: CrudAmbienteComponent;
  let fixture: ComponentFixture<CrudAmbienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudAmbienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudAmbienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
