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

  onTeamSelect(team: WormsTeamEnum) {
    this.teamSelect.emit(team);
  }

}
