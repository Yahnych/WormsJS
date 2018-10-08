import * as express from 'express'
import * as cors from 'cors'
import * as socketio from 'socket.io'
import { RoomController } from './controller/room-controller';
const app: express.Application = express()

const registerRoutesFromControllers = (app: express.Application) => {
    new RoomController(app)
}

app.use(cors())
registerRoutesFromControllers(app)

const server = app.listen(8080, 'localhost', () => {
    console.log('App listening on http://127.0.0.1:8080')
})

const io: socketio.Server = socketio(server)

io.on('connection', (socket: socketio.Socket) => {
    console.log('A user connected')
})