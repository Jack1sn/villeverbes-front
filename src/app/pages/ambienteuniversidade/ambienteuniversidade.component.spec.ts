import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbienteuniversidadeComponent } from './ambienteuniversidade.component';

describe('AmbienteuniversidadeComponent', () => {
  let component: AmbienteuniversidadeComponent;
  let fixture: ComponentFixture<AmbienteuniversidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmbienteuniversidadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmbienteuniversidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
