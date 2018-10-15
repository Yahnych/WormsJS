import {Component, OnInit} from '@angular/core'
import * as io from 'socket.io-client'
import { Player, Room } from '../model';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loginForm: FormGroup;
  title = 'front';
  rooms: Room[];
  joinedRoom: number;
  player: Player;
  private socket;
  private isLogged: boolean = false;
  constructor(public fb: FormBuilder) {
    this.socket = io('http://localhost:8080/');
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
      username: ["", Validators.required],
      room: [null, Validators.required]
    });
  }

  public onSubmit(): void {
    this.joinedRoom = this.loginForm.get('room').value;
    this.socket.emit('roomJoin', this.joinedRoom, this.loginForm.get('username').value);
    this.isLogged = true;
    this.socket.on('roomUpdate', (room: Room) => {
      this.rooms[room.id] = room;
      console.log(this.rooms);
    })
  }
}
