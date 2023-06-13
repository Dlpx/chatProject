import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './routers/views.router.js'

const app = express()
const httpServer = app.listen(8080, () => console.log('Srv Up!'))
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')
app.use(express.static('./src/public'))
app.use('/', viewsRouter)

const messages = []
const db = []

io.on('connection', socket => {

    socket.on('userName', name => {
        let oldUser = db.find(item => item.id === socket.id);
        if(!oldUser){
            db.push({id: socket.id, name: name})
            socket.broadcast.emit('alerta', {name: name})
        } else {
            socket.broadcast.emit('alerta', {name: name})
        }
        
        socket.emit('logs', messages)
        socket.on('message', data => {
            messages.push(data)
            io.emit('logs', messages)
        })
    })



})