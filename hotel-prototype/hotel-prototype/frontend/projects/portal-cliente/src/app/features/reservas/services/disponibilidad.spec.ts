import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DisponibilidadService } from './disponibilidad';
import { API_BASE_URL } from '../../../config/api.config';

describe('DisponibilidadService', () => {
  let service: DisponibilidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DisponibilidadService,
        { provide: API_BASE_URL, useValue: 'http://test-url/api' }
      ]
    });
    service = TestBed.inject(DisponibilidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
