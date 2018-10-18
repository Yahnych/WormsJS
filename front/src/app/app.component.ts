import {Component, OnInit} from '@angular/core'
import * as io from 'socket.io-client'
import {Player, Room} from '../model';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WormsTeamEnum} from "../enum/worms-team-enum";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loginForm: FormGroup;
  messagesForm: FormGroup;
  title = 'WormsJS';
  rooms: Room[];
  joinedRoom: number;
  player: Player;
  public isLogged: boolean = false;
  public isPlaying: boolean = false;
  public messages: string[] = ["Test", "test2"];
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
    this.messagesForm = this.fb.group({
      message: ''
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
    });
    this.socket.on('messageReceived', (message: string) => {
      this.messages.push(message);
    });
  }

  public onTeamSelect(team: WormsTeamEnum): void {
    this.socket.emit('teamSelect', team, this.player);
  }

  public onPlayButton(): void {
    this.isPlaying = true;
  }

  public sendMessage(): void {
    let message: string = this.messagesForm.get('message').value;
    if (message.length > 0) {
      this.socket.emit('messageSent', message, this.player);
      this.messagesForm.get('message').reset();
    }
  }

  public openCloseMessages(): void {
    document.getElementById('messages').style.height =
      document.getElementById('messages').style.height === '400px' ? '50px' : '400px';
  }
}
