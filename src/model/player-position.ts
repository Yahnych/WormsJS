export class PlayerPosition {

    x: number = 0
    y: number = 0

    constructor(x?: number, y?: number) {
        if (x) {
            this.x = x
        }
        if (y) {
            this.y = y
        }
    }
}