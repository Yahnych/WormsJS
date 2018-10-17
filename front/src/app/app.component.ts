import {Component, OnInit} from '@angular/core'
import * as io from 'socket.io-client'
import { Player, Room } from '../model';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WormsTeamEnum} from "../enum/worms-team-enum";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loginForm: FormGroup;
  title = 'WormsJS';
  rooms: Room[];
  joinedRoom: number;
  player: Player;
  public isLogged: boolean = false;
  public isPlaying: boolean = false;
  private socket;
  constructor(public fb: FormBuilder) {
    this.socket = io();
    this.socket.on('rooms', (rooms: Room[]) => {
      this.rooms = rooms;
      console.log(this.rooms);
    });
    this.socket.emit('roomRequest');
  }

  public ngOnInit() {
    this.initForm();
  }

  public initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      room: [null, Validators.required]
    });
  }

  public onSubmit(): void {
    this.joinedRoom = this.loginForm.get('room').value;
    this.player = new Player(this.loginForm.get('username').value);
    this.socket.emit('roomJoin', this.joinedRoom, this.player.name);
    this.socket.on('userConnected', (id: number) => {
      this.player.id = id;
    });
    this.isLogged = true;
    this.socket.on('roomUpdate', (room: Room) => {
      this.rooms[room.id] = room;
    })
  }

  public onTeamSelect(team: WormsTeamEnum): void {
    this.socket.emit('teamSelect', team, this.player);
  }

  public onPlayButton(): void {
    this.isPlaying = true;
  }
}
