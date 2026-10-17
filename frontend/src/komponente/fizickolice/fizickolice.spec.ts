import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fizickolice } from './fizickolice';

describe('Fizickolice', () => {
  let component: Fizickolice;
  let fixture: ComponentFixture<Fizickolice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fizickolice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fizickolice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
