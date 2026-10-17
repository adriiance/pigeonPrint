import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detaljiprosireno } from './detaljiprosireno';

describe('Detaljiprosireno', () => {
  let component: Detaljiprosireno;
  let fixture: ComponentFixture<Detaljiprosireno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detaljiprosireno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detaljiprosireno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
