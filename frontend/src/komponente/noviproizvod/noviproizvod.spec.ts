import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Noviproizvod } from './noviproizvod';

describe('Noviproizvod', () => {
  let component: Noviproizvod;
  let fixture: ComponentFixture<Noviproizvod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Noviproizvod]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Noviproizvod);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
