import { Component } from '@angular/core';
import {Input} from "@angular/core";
import {Player} from "../../model";

@Component({
  selector: 'worms-player-list',
  templateUrl: './worms-player-list.component.html',
  styleUrls: ['./worms-player-list.component.css']
})
export class WormsPlayerListComponent {

  @Input() public players: Player[];

  constructor() {

  }


}
