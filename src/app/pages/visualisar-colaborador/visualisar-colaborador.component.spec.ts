import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualisarColaboradorComponent } from './visualisar-colaborador.component';

describe('VisualisarColaboradorComponent', () => {
  let component: VisualisarColaboradorComponent;
  let fixture: ComponentFixture<VisualisarColaboradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualisarColaboradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualisarColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
