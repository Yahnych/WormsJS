import { Component } from '@angular/core'
import * as io from 'socket.io-client'
import { Player, PlayerPosition, Direction, Room } from '../model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front'
  rooms: Room[] = []
  roomIndex: number
  player: Player = new Player('1', 'Player 1')
  private socket
  constructor() {
    this.socket = io('http://localhost:8080/')
    this.socket.on('rooms', (rooms: Room[]) => {
      this.rooms = rooms
    })
    this.socket.emit('roomRequest')
  }

  public becomePlayer(id: string) {
    this.player.id = id
    this.player.name = `Player ${id}`
  }

  public joinRoom(id: string) {
    console.log('joining room ' + id)
    const index = this.rooms.findIndex((room: Room) => {
      return room.id === id
    })
    if (index >= 0) {
      this.roomIndex = index
    }
    this.socket.emit('roomJoin', id, this.player)
    this.socket.on('newUser', (newPlayer: Player) => {
      console.log('new user connected on room ' + id)
    })
    this.socket.on('roomUpdate', (room: Room) => {
      this.rooms[this.roomIndex] = room
      console.log(this.rooms)
    })
  }

  public moveLeft() {
    this.socket.emit('move', new Direction(1, 0, 1));
  }
}
