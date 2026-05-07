import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DisponibilidadService } from './disponibilidad';

describe('DisponibilidadService', () => {
  let service: DisponibilidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DisponibilidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});