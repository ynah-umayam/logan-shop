import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticateGuardService } from './authenticate.guard';
import { of } from 'rxjs';

class MockRouter {
  navigateByUrl = () => {};
}

describe('AuthenticateGuardService', () => {
  let service: AuthenticateGuardService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticateGuardService,
        { provide: Router, useClass: MockRouter },
      ],
    });

    service = TestBed.inject(AuthenticateGuardService);
    router = TestBed.inject(Router);

    const localStorageMock = {
      getItem: jest.fn(),
    };
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });
  });

  describe('canActivate', () => {
    it('should return true if user is authenticated', (done) => {
      jest.spyOn(localStorage, 'getItem').mockReturnValue('true');

      service.canActivate().subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should navigate to "/error" and return false if user is not authenticated', (done) => {
      jest.spyOn(localStorage, 'getItem').mockReturnValue(null);
      jest
        .spyOn(router, 'navigateByUrl')
        .mockReturnValue(Promise.resolve(true));

      service.canActivate().subscribe(() => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/error');
        done();
      });
    });
  });
});
