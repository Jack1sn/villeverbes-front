import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimFaseComponent } from './prim-fase.component';

describe('PrimFaseComponent', () => {
  let component: PrimFaseComponent;
  let fixture: ComponentFixture<PrimFaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimFaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimFaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
