import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { RoomsComponent } from './rooms.component';
import { UnauthorizedComponent } from './unauthorized.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  imports: [SharedModule, AdminRoutingModule],
  declarations: [
    AdminLayoutComponent, // ← Shell con topbar + <router-outlet>
    RoomsComponent,
    UnauthorizedComponent,
  ],
})
export class AdminModule {}
