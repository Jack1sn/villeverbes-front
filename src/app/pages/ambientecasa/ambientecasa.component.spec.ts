import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbientecasaComponent } from './ambientecasa.component';

describe('AmbientecasaComponent', () => {
  let component: AmbientecasaComponent;
  let fixture: ComponentFixture<AmbientecasaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmbientecasaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmbientecasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
