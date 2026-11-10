import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormioAppConfig, FormioModule } from '@formio/angular';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideKeycloak,
  withAutoRefreshToken,
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  UserActivityService,
  AutoRefreshTokenService
} from 'keycloak-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideKeycloak({
      config: {
        url: 'http://localhost:3000',
        realm: 'workflow-engine',
        clientId: 'workflow-engine-ui'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      },
      features: [
        withAutoRefreshToken({
          onInactivityTimeout: 'logout',
          sessionTimeout: 300000
        })
      ],
      providers: [AutoRefreshTokenService, UserActivityService]
    }),

    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [
        { urlPattern: /^http:\/\/localhost:8000\/.*/i } // placeholder until FastAPI exists
      ]
    },

    importProvidersFrom(FormioModule),
    {
      provide: FormioAppConfig,
      useValue: { appUrl: '', apiUrl: '', icons: 'bootstrap' }
    },
    
  ]
};
