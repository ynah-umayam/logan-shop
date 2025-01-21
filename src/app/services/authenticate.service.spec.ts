import { TestBed } from '@angular/core/testing';

import { AuthenticateService } from './authenticate.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('AuthenticateService', () => {
  let service: AuthenticateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthenticateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('authenticateUser$', () => {
    it('should return true for valid credentials', (done) => {
      service
        .authenticateUser$('abc@yahoo.com', 'Testpassw0rd!')
        .subscribe((isAuthenticated) => {
          expect(isAuthenticated).toBe(true);
          done();
        });
    });

    it('should return false for invalid credentials', (done) => {
      service
        .authenticateUser$('wrong@yahoo.com', 'wrongpassword')
        .subscribe((isAuthenticated) => {
          expect(isAuthenticated).toBe(false);
          done();
        });
    });
  });

  describe('getUserDetails$', () => {
    it('should fetch user details from the API if the user is authenticated', (done) => {
      const mockResponse = {
        email: 'abc@yahoo.com',
        first_name: 'John',
        last_name: 'Doe',
      };
      localStorage.setItem('isUserAuthenticated', 'true');
      service.getUserDetails$().subscribe((user) => {
        expect(user).toEqual({
          email: 'abc@yahoo.com',
          firstName: 'John',
          lastName: 'Doe',
        });
        done();
      });

      const req = httpMock.expectOne('/assets/mocks/user.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return default user details if the user is not authenticated', (done) => {
      service.getUserDetails$().subscribe((user) => {
        expect(user).toEqual({
          email: '',
          firstName: '',
          lastName: '',
        });
        done();
      });
    });

    it('should update the BehaviorSubject when fetching user details', (done) => {
      const mockResponse = {
        email: 'abc@yahoo.com',
        first_name: 'John',
        last_name: 'Doe',
      };
      localStorage.setItem('isUserAuthenticated', 'true');

      service.getUserDetails$().subscribe((user) => {
        expect(user).toEqual({
          email: 'abc@yahoo.com',
          firstName: 'John',
          lastName: 'Doe',
        });
        done();
      });

      const req = httpMock.expectOne('/assets/mocks/user.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
