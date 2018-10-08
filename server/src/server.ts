import * as express from 'express'
import * as cors from 'cors'
import * as socketio from 'socket.io'

import { RoomController } from './controller/room-controller';

import { Player, Weapon, Direction, Room } from './model'

const app: express.Application = express()

const registerRoutesFromControllers = (app: express.Application) => {
    new RoomController(app)
}

app.use(cors())

registerRoutesFromControllers(app)

// let game: WormsGame = null

const server = app.listen(8080, 'localhost', () => {
    console.log('App listening on http://127.0.0.1:8080')
    // game = new WormsGame()
})

const io: socketio.Server = socketio(server)

let rooms: Room[] = [
    new Room('1', 'Room 1'),
    new Room('2', 'Room 2'),
    new Room('3', 'Room 3'),
    new Room('4', 'Room 4'),
]

io.on('connection', (socket: socketio.Socket) => {

    console.log('An user connected')

    socket.on('roomRequest', () => {
        socket.emit('rooms', rooms)
    })

    socket.on('roomJoin', (id: string, joinedPlayer: Player) => {

        console.log(joinedPlayer.name + ' just joined room ' + id)

        let roomIndex: number = rooms.findIndex((room: Room) => { return room.id === id })

        if (roomIndex >= 0) {

            rooms[roomIndex].players.push(new Player(joinedPlayer.id, joinedPlayer.name, joinedPlayer.position))
            let playerIndex = rooms[roomIndex].players.length - 1

            io.emit('rooms', rooms)

            socket.join(id, () => {

                io.to(id).emit('newUser', joinedPlayer)

                socket.on('move', (direction: Direction) => {
                    console.log(playerIndex)
                    rooms[roomIndex].players[playerIndex].move(direction)
                    io.to(id).emit('roomUpdate', rooms[roomIndex])
                })

                socket.on('fire', (player: Player, weapon: Weapon, direction: Direction) => {
                    io.to(id).emit('fired')
                })

                socket.on('weaponChange', (player: Player, weapon: Weapon) => {
                    io.to(id).emit('weaponChanged')
                })
            })
        }
    })
})
