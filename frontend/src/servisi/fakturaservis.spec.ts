import { TestBed } from '@angular/core/testing';

import { Fakturaservis } from './fakturaservis';

describe('Fakturaservis', () => {
  let service: Fakturaservis;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fakturaservis);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
