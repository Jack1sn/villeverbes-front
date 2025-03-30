import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fase3Component } from './fase3.component';

describe('Fase3Component', () => {
  let component: Fase3Component;
  let fixture: ComponentFixture<Fase3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fase3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fase3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
