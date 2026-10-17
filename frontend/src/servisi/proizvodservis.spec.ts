import { TestBed } from '@angular/core/testing';

import { Proizvodservis } from './proizvodservis';

describe('Proizvodservis', () => {
  let service: Proizvodservis;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Proizvodservis);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
