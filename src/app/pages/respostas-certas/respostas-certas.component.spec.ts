import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespostasCertasComponent } from './respostas-certas.component';

describe('RespostasCertasComponent', () => {
  let component: RespostasCertasComponent;
  let fixture: ComponentFixture<RespostasCertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RespostasCertasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespostasCertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
