import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../model";

@Component({
  selector: 'worms-game',
  templateUrl: './worms-game.component.html',
  styleUrls: ['./worms-game.component.css']
})
export class WormsGameComponent implements OnInit {

  @Input() player: Player;
  @Input() players: Player[];
  @Input() redTeam: Player[];
  @Input() blueTeam: Player[];

  constructor() {
  }

  ngOnInit() {
  }

}
