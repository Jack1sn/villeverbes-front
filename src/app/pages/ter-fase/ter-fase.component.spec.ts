import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerFaseComponent } from './ter-fase.component';

describe('TerFaseComponent', () => {
  let component: TerFaseComponent;
  let fixture: ComponentFixture<TerFaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerFaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerFaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
