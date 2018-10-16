import { Player } from './player'

export class Room {
  id: number;
  name: string = '';
  players: Player[] = [];
  blueTeam: Player[] = [];
  redTeam: Player[] = [];

  constructor(id?: number, name?: string, players?: Player[]) {
    if (id)
      this.id = id;
    if (name)
      this.name = name;
    if (players)
      this.players = players;
  }
}
