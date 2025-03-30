import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudfasesComponent } from './crudfases.component';

describe('CrudfasesComponent', () => {
  let component: CrudfasesComponent;
  let fixture: ComponentFixture<CrudfasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudfasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudfasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
