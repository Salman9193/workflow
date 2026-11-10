import { Component, inject } from '@angular/core';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private keycloak = inject(Keycloak);
  private keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  get isReady(): boolean {
    return this.keycloakSignal().type === KeycloakEventType.Ready;
  }

  get username(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  login(): void {
    this.keycloak.login();
  }
}
