import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  readonly currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
  }
}
