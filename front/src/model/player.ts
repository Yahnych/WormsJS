import { PlayerPosition } from "./player-position";
import { Direction } from "./direction";

export class Player {

    id: string = ''
    name: string = ''
    position: PlayerPosition = new PlayerPosition(0, 0)

    constructor(id: string, name: string, position?: PlayerPosition) {
        this.id = id
        this.name = name
        if (position) {
            this.position = position
        }
    }

    public move(direction: Direction) {
        console.log(this.position, direction)
        this.position.x += direction.x * direction.strength
        this.position.y += direction.y * direction.strength
    }
}