import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Player} from '../../model';
import {WormsTeamEnum} from '../../enum/worms-team-enum';

@Component({
  selector: 'worms-player-list',
  templateUrl: './worms-player-list.component.html',
  styleUrls: ['./worms-player-list.component.css']
})
export class WormsPlayerListComponent {

  @Input() public players: Player[];
  @Input() public player: Player;
  @Input() public redTeam: Player[] = [];
  @Input() public blueTeam: Player[] = [];

  @Output() public teamSelect: EventEmitter<any> = new EventEmitter();


  public WormsTeamEnum = WormsTeamEnum;

  constructor() {

  }

  public onTeamSelect(team: WormsTeamEnum) {
    if (this.canJoinTeam(team)) {
      this.teamSelect.emit(team);
    }
  }

  public canJoinTeam(team: WormsTeamEnum): boolean {
    switch (team) {
      case WormsTeamEnum.BLUE_TEAM:
        return this.blueTeam.length < 2 && !this.blueTeam.find((p: Player) => p.id === this.player.id);
        break;
      case WormsTeamEnum.RED_TEAM:
        return this.redTeam.length < 2 && !this.redTeam.find((p: Player) => p.id === this.player.id);
        break;
    }
    return false;
  }

}
