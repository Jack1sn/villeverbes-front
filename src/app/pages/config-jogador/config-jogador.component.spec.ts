import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigJogadorComponent } from './config-jogador.component';

describe('ConfigJogadorComponent', () => {
  let component: ConfigJogadorComponent;
  let fixture: ComponentFixture<ConfigJogadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigJogadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigJogadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
