import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CheckInComponent } from './check-in.component';
import { CheckOutComponent } from './check-out.component';
import { OperationsRoutingModule } from './operations-routing.module';

@NgModule({
  imports: [SharedModule, OperationsRoutingModule],
  declarations: [CheckInComponent, CheckOutComponent],
})
export class OperationsModule {}
