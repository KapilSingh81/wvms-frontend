import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { HttpInterceptorService } from './features/shared/services/interceptors/http.interceptor';
import { AuthService } from './features/shared/services/auth-service/auth-service';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PositioningService } from 'ngx-bootstrap/positioning';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([HttpInterceptorService])
    ),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
      newestOnTop: true,
    }),
    BsModalService,
    ComponentLoaderFactory,
    PositioningService,
  ]
};
