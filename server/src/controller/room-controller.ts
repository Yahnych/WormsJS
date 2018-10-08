import * as express from 'express'
import { BaseController } from './base-controller'
import { Room } from '../model/room'
import { Player } from '../model/player';
import { Response, Request } from 'express';

export class RoomController extends BaseController {

    constructor(app: express.Application) {
        super('room')
        app.get(this.BASE_ROUTE, (req: Request, res: Response) => this.getAllRooms(req, res))
        app.get(`${this.BASE_ROUTE}/:id`, (req: Request, res: Response) => this.getRoomById(req, res))
    }

    /**
     * @param req Request
     * @param res Response
     * @returns Room[]
     */
    getAllRooms(req: Request, res: Response) {
        res.status(200).json([
            new Room('1', 'Room 1'),
            new Room('2', 'Room 2', [new Player('1', 'Player 1')]),
            new Room('3', 'Room 3', [new Player('2', 'Player 2'), new Player('3', 'Player 3'), new Player('4', 'Player 4'), new Player('5', 'Player 5')]),
            new Room('4', 'Room 4'),
        ])
    }

    /**
     * @param req Request with id
     * @param res Response
     * @returns Room
     */
    getRoomById(req: Request, res: Response) {
        let result = [
            new Room('1', 'Room 1'),
            new Room('2', 'Room 2', [new Player('1', 'Player 1')]),
            new Room('3', 'Room 3', [new Player('2', 'Player 2'), new Player('3', 'Player 3'), new Player('4', 'Player 4'), new Player('5', 'Player 5')]),
            new Room('4', 'Room 4'),
        ].find((room: Room) => {
            return room.id === req.params.id
        })
        if (result)
            res.status(200).json(result)
        else
            res.status(404).send('Not found')
    }

}