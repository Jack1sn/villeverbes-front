import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecFaseComponent } from './sec-fase.component';

describe('SecFaseComponent', () => {
  let component: SecFaseComponent;
  let fixture: ComponentFixture<SecFaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecFaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecFaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
