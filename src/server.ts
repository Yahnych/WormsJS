import * as express from 'express';
import * as cors from 'cors';
import * as socketio from 'socket.io';

import {Direction, Player, Room, Weapon} from './model';
import {WormsTeamEnum} from "./enum/worms-team-enum";

const app: express.Application = express();

app.use(cors());

app.use(express.static(__dirname + '/front'));

const server = app.listen(process.env.PORT || 8080);

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
        const joinedPlayer: Player = new Player(joinedPlayerName);
        let joinedTeam: WormsTeamEnum;
        console.log(id);
        console.log(joinedPlayer.name + ' just joined room ' + rooms[id].name);

        if (id >= 0 && id < rooms.length) {
            joinedPlayer.id = nextPlayerId++;
            rooms[id].players.push(joinedPlayer);

            socket.emit('userConnected', joinedPlayer.id);

            io.emit('rooms', rooms);
            const socketRoomName: string = `room${id}`;
            socket.join(socketRoomName, () => {

                socket.on('disconnect', () => {
                    disconnectUser(id, joinedPlayer, joinedTeam);
                    io.emit('rooms', rooms);
                    io.to(socketRoomName).emit('userDisconnected', joinedPlayer);
                });

                socket.on('messageSent', (message: string, player: Player) => {
                    io.to(socketRoomName).emit('messageReceived', `${player.name}: ${message}`);
                });

                socket.on('teamSelect', (team: WormsTeamEnum, player: Player) => {
                    let index: number;
                    switch (team) {
                        case WormsTeamEnum.BLUE_TEAM:
                            if (rooms[id].blueTeam.findIndex((p) => {
                                return p.id === player.id
                            }) === -1) {
                                rooms[id].blueTeam.push(player);
                            }
                            index = rooms[id].redTeam.findIndex((p) => {
                                return p.id === player.id
                            });
                            if (index !== -1) {
                                rooms[id].redTeam.splice(index, 1)
                            }
                            break;
                        case WormsTeamEnum.RED_TEAM:
                            if (rooms[id].redTeam.findIndex((p) => {
                                return p.id === player.id
                            }) === -1) {
                                rooms[id].redTeam.push(player);
                            }
                            index = rooms[id].blueTeam.findIndex((p) => {
                                return p.id === player.id
                            });
                            if (index !== -1) {
                                rooms[id].blueTeam.splice(index, 1)
                            }
                            break;
                    }
                    joinedTeam = team;
                    io.to(socketRoomName).emit('roomUpdate', rooms[id]);
                });

                io.to(socketRoomName).emit('newUser', joinedPlayer);

                socket.on('move', (direction: Direction) => {
                    let index = rooms[id].players.findIndex((p: Player) => {
                        return p.id === joinedPlayer.id;
                    });
                    rooms[id].players[index].move(direction);
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

function disconnectUser(roomId: number, playerToDisconnect: Player, team?: WormsTeamEnum): void {
    switch (team) {
        case WormsTeamEnum.BLUE_TEAM:
            rooms[roomId].blueTeam.splice(rooms[roomId].blueTeam.findIndex((p: Player) => {
                return p.id === playerToDisconnect.id;
            }), 1);
            break;
        case WormsTeamEnum.RED_TEAM:
            rooms[roomId].redTeam.splice(rooms[roomId].redTeam.findIndex((p: Player) => {
                return p.id === playerToDisconnect.id;
            }), 1);
            break;
    }
    rooms[roomId].players.splice(rooms[roomId].players.findIndex((p: Player) => {
        return p.id === playerToDisconnect.id;
    }), 1);
}
