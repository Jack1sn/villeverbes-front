import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbienteparqueComponent } from './ambienteparque.component';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
describe('AmbienteparqueComponent', () => {
  let component: AmbienteparqueComponent;
  let fixture: ComponentFixture<AmbienteparqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmbienteparqueComponent, RouterModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmbienteparqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
