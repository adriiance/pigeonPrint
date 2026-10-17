import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kupovina } from './kupovina';

describe('Kupovina', () => {
  let component: Kupovina;
  let fixture: ComponentFixture<Kupovina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kupovina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kupovina);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
