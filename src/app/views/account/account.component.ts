import { Component } from '@angular/core';
import { TheOrangeAllianceGlobals } from '../../app.globals';
import { Router } from "@angular/router";
import { FTCDatabase } from "../../providers/ftc-database";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { TeamSorter } from "../../util/team-utils";
import { EventSorter } from "../../util/event-utils";
import Team from "../../models/Team";
import Event from "../../models/Event";

@Component({
  selector: 'toa-account',
  templateUrl: './account.component.html',
  providers: [TheOrangeAllianceGlobals]
})

export class AccountComponent {

  user = [];

  teams: Team[];
  events: Event[];

  loaded: boolean;

  constructor(private app: TheOrangeAllianceGlobals, private router: Router, private ftc: FTCDatabase,
              db: AngularFireDatabase, public auth: AngularFireAuth) {
    this.app.setTitle('myTOA');

    auth.authState.subscribe(user => {
      if (user !== null && user !== undefined) {
        this.user['email'] = user.email;
        db.list(`Users/${user.uid}`).snapshotChanges()
          .subscribe(items => {

            if (!this.loaded) {
              this.teams = [];
              this.events = [];

              let teamsSorter = new TeamSorter();
              let eventsSorter = new EventSorter();

              items.forEach(element => {
                this.user[element.key] = element.payload.val();
              });

              let teams = this.user['favTeams'];
              for (let key in teams) {
                if (teams[key] === true) {
                  this.ftc.getTeamBasic(key).then((team: Team) => {
                    this.teams.push(team)
                    this.teams = teamsSorter.sort(this.teams, 0, this.teams.length - 1);
                  });
                }
              }

              let events = this.user['favEvents'];
              for (let key in events) {
                if (events[key] === true) {
                  this.ftc.getEventBasic(key).then((event: Event) => {
                    this.events.push(event)
                    this.events = eventsSorter.sort(this.events, 0, this.events.length - 1);
                  });
                }
              }

              this.loaded = true;
            }
          });
      } else {
        this.router.navigateByUrl('/account/login');
      }
    });

  }

  signOut(): void {
    this.auth.auth.signOut().then(() => {
      this.router.navigateByUrl("/account/login");
    });
  }
}
