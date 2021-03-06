import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import Match from '../../../../models/Match';

@Component({
  selector: 'toa-velocity-vortex',
  templateUrl: './1617-velocity-vortex.component.html'
})
export class VelocityVortexComponent {

  @Input() match: Match;

  constructor(private router: Router) {}

  openTeamPage(teamKey: number) {
    this.router.navigate(['/teams', teamKey]);
  }

  openEvent(eventKey: string): void {
    this.router.navigate(['/events', eventKey]);
  }

}
