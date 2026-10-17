import { TestBed } from '@angular/core/testing';

import { Klijentservis } from './klijentservis';

describe('Klijentservis', () => {
  let service: Klijentservis;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Klijentservis);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
