import { Player } from './player'

export class Room {
    id: string = ''
    name: string = ''
    players: Player[] = []

    constructor(id?: string, name?: string, players?: Player[]) {
        if (id)
            this.id = id
        if (name)
            this.name = name
        if (players)
            this.players = players
    }
}