import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../model";
import * as Phaser from "phaser";

class WormsScene extends Phaser.Scene {
  load: any;
  add: any;
  gameComponent: WormsGameComponent;
  constructor(config, gameComponent) {
    super(config);
    this.gameComponent = gameComponent
  }

  preload() {
    console.log("prelaod");
    this.load.image('worm-left', 'assets/worm-left.png');
    this.load.image('worm-right', 'assets/worm-right.png');
  }

  create() {
    console.log("create");
    this.gameComponent.blueTeam.forEach((blueWorm) => {
      this.add.image(blueWorm.position.x, blueWorm.position.y, 'worm-right');
      this.add.text(blueWorm.position.x, blueWorm.position.y - 20, blueWorm.name);
    });
    this.gameComponent.redTeam.forEach((redWorm) => {
      this.add.image(redWorm.position.x, redWorm.position.y, 'worm-left');
      this.add.text(redWorm.position.x, redWorm.position.y - 20, redWorm.name);
    });
  }

  update() {
  }

}

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

  config: GameConfig = {};
  game: Phaser.Game;

  constructor() {
  }

  ngOnInit() {
    this.config = Object.assign(this.config, {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "WormsGame"
    });
    this.config.scene = new WormsScene(this.config, this);
    this.game = new Phaser.Game(this.config);
  }

}

interface PhaserConfig {
  type: number;
  width: number;
  height: number;
  parent: string;
  scene: Phaser.Scene;
}
