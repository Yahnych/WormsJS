import {Component, EventEmitter, OnInit} from '@angular/core'
import * as io from 'socket.io-client'
import {Direction, Player, Room, Weapon} from '../model';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WormsTeamEnum} from "../enum/worms-team-enum";
import {environment} from "../environments/environment";

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
  public isMessagesOpen: boolean = true;
  public messages: string[] = [];
  public gameStateUpdate: EventEmitter<any> = new EventEmitter();
  private socket;

  constructor(public fb: FormBuilder) {
    this.socket = io(environment.socketUrl);
    this.socket.on('rooms', (rooms: Room[]) => {
      this.rooms = rooms;
      console.log(this.rooms);
    });
    this.socket.emit('roomRequest');
  }

  public ngOnInit() {
    this.initForm();
  }

  public scrollToBottom(): void {
    var messagesBox = document.getElementById("messagesBox");
    messagesBox.scrollTop = messagesBox.scrollHeight;
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
      if (this.isPlaying) {
        this.gameStateUpdate.emit(this.rooms[room.id]);
      }
    });
    this.socket.on('userDisconnected', (user: Player) => {
      this.messages.push(`${user.name} just disconnected from the game.`);
      setTimeout(this.scrollToBottom, 10);
    });
    this.socket.on('messageReceived', (message: string) => {
      this.messages.push(message);
      setTimeout(this.scrollToBottom, 10);
    });
    this.socket.on('gameStarted', () => {
      this.isPlaying = true;

      this.socket.on('fired', (player: Player, weapon: Weapon, direction: Direction) => {
        console.log(`${player.name} fired using ${weapon.name} on with a strength of ${direction.strength}`);
      });

      this.socket.on('weaponChanged', (player: Player, weapon: Weapon) => {
        console.log(`${player.name} changed weapon to ${weapon.name}`);
      });
    });
  }

  public onTeamSelect(team: WormsTeamEnum): void {
    this.socket.emit('teamSelect', team, this.player);
  }

  public onPlayButton(): void {
    this.socket.emit('play');
  }

  public sendMessage(): void {
    const message: string = this.messagesForm.get('message').value;
    if (message.length > 0) {
      this.socket.emit('messageSent', message, this.player);
      this.messagesForm.get('message').reset();
    }
  }

  public openCloseMessages(): void {
    this.isMessagesOpen = !this.isMessagesOpen;
    document.getElementById('messages').style.height =
      this.isMessagesOpen ? '400px' : '50px';
  }
}
