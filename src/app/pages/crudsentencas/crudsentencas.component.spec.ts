import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudsentencasComponent } from './crudsentencas.component';

describe('CrudsentencasComponent', () => {
  let component: CrudsentencasComponent;
  let fixture: ComponentFixture<CrudsentencasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudsentencasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudsentencasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
