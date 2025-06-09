import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarJogadoresComponent } from './visualizar-jogadores.component';

describe('VisulizarJogadoresComponent', () => {
  let component: VisualizarJogadoresComponent;
  let fixture: ComponentFixture<VisualizarJogadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarJogadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarJogadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
