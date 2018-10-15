import * as express from 'express';
import * as cors from 'cors';
import * as socketio from 'socket.io';

import { Player, Weapon, Direction, Room } from './model';

const app: express.Application = express();

app.use(cors());

const server = app.listen(8080, 'localhost', () => {
    console.log('App listening on http://127.0.0.1:8080');
});

const io: socketio.Server = socketio(server);

let nextPlayerId: number = 0;

let rooms: Room[] = [
    new Room(0, 'Room 1'),
    new Room(1, 'Room 2'),
    new Room(2, 'Room 3'),
    new Room(3, 'Room 4'),
];

io.on('connection', (socket: socketio.Socket) => {

    console.log('An user connected');

    socket.on('roomRequest', () => {
        socket.emit('rooms', rooms);
    });

    socket.on('roomJoin', (id: number, joinedPlayerName: string) => {
        let joinedPlayer: Player = new Player(joinedPlayerName);
        console.log(id);
        console.log(joinedPlayer.name + ' just joined room ' + rooms[id].name);

        if (id >= 0 && id < rooms.length) {
            joinedPlayer.id = nextPlayerId++;
            rooms[id].players.push(joinedPlayer);

            io.emit('rooms', rooms);
            let socketRoomName: string = `room${id}`;
            socket.join(socketRoomName, () => {

                socket.on('disconnect', () => {
                    rooms[id].players.splice(getPlayerIndex(id, joinedPlayer), 1);
                    io.emit('rooms', rooms);
                    io.to(socketRoomName).emit('userDisconnected', joinedPlayer);
                });

                io.to(socketRoomName).emit('newUser', joinedPlayer);

                socket.on('move', (direction: Direction) => {
                    rooms[id].players[getPlayerIndex(id, joinedPlayer)].move(direction);
                    io.to(socketRoomName).emit('roomUpdate', rooms[id]);
                });

                socket.on('fire', (player: Player, weapon: Weapon, direction: Direction) => {
                    io.to(socketRoomName).emit('fired');
                });

                socket.on('weaponChange', (player: Player, weapon: Weapon) => {
                    io.to(socketRoomName).emit('weaponChanged');
                });
            });
        }
    });
});

function getPlayerIndex(roomId: number, playerToFind: Player): number {
    return rooms[roomId].players.findIndex((player) => { return player.id === playerToFind.id })
}
