import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pravnolice } from './pravnolice';

describe('Pravnolice', () => {
  let component: Pravnolice;
  let fixture: ComponentFixture<Pravnolice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pravnolice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pravnolice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
