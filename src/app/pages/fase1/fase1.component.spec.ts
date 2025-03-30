import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fase1Component } from './fase1.component';

describe('Fase1Component', () => {
  let component: Fase1Component;
  let fixture: ComponentFixture<Fase1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fase1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fase1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
