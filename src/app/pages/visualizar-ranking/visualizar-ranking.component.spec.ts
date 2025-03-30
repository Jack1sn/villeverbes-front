import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarRankingComponent } from './visualizar-ranking.component';

describe('VisualizarRankingComponent', () => {
  let component: VisualizarRankingComponent;
  let fixture: ComponentFixture<VisualizarRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarRankingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
