import { PlayerPosition } from "./player-position";
import { Direction } from "./direction";

export class Player {

    public id?: number;
    public name = '';
    public position: PlayerPosition = new PlayerPosition(0, 0);

    constructor(name: string) {
        this.name = name;
    }

    public move(direction: Direction) {
        this.position.x += direction.x * direction.strength;
        this.position.y += direction.y * direction.strength;
    }
}
