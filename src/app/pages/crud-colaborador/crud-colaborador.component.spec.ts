import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudColaboradorComponent } from './crud-colaborador.component';

describe('CrudColaboradorComponent', () => {
  let component: CrudColaboradorComponent;
  let fixture: ComponentFixture<CrudColaboradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudColaboradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
