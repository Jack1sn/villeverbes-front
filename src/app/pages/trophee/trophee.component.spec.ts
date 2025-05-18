import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TropheeComponent } from './trophee.component';

describe('TropheeComponent', () => {
  let component: TropheeComponent;
  let fixture: ComponentFixture<TropheeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TropheeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TropheeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
