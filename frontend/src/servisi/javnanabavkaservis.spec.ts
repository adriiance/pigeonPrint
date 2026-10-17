import { TestBed } from '@angular/core/testing';

import { Javnanabavkaservis } from './javnanabavkaservis';

describe('Javnanabavkaservis', () => {
  let service: Javnanabavkaservis;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Javnanabavkaservis);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
