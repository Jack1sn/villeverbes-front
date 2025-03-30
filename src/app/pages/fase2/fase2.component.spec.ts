import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fase2Component } from './fase2.component';

describe('Fase2Component', () => {
  let component: Fase2Component;
  let fixture: ComponentFixture<Fase2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fase2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fase2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
