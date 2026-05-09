import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckInComponent } from './check-in.component';
import { CheckOutComponent } from './check-out.component';

const routes: Routes = [
  { path: '', redirectTo: 'check-in', pathMatch: 'full' },
  { path: 'check-in', component: CheckInComponent },
  { path: 'check-out', component: CheckOutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationsRoutingModule {}
