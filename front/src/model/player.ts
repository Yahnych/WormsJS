import { PlayerPosition } from "./player-position";
import { Direction } from "./direction";

export class Player {

    id: number;
    name: string = '';
    position: PlayerPosition = new PlayerPosition(0, 0);

    constructor(name: string) {
        this.name = name;
    }

    public move(direction: Direction) {
        console.log(this.position, direction);
        this.position.x += direction.x * direction.strength;
        this.position.y += direction.y * direction.strength;
    }
}
