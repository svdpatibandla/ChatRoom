const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes')
const User = require('./models/User');
const Message = require('./models/Message')
const rooms = ['CMPE-272', 'CMPE-273', 'CMPE-255', 'CMPE-206'];
const cors = require('cors');
const redis = require('redis');

const redisUrl = 'redis://127.0.0.1:6379'; 
const redisClient = redis.createClient(redisUrl);

const session = require('express-session'); 
const RedisStore = require('connect-redis')(session);

// Configure the Redis store 
const store = new RedisStore({ client: redisClient, ttl: 3600 });
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(session({
  store:store,
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false
  }));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({
  origin: 'http://http://ec2-18-212-66-193.compute-1.amazonaws.com:3000/'
}));

app.use('/users', userRoutes)
require('./connection')

app.get('/', (req,res)=>{
  res.send('ChatAPP Here...!');
})

const server = require('http').createServer(app);
const PORT = 5001;
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

async function getLastMessagesFromRoom(room){
  let roomMessages = await Message.aggregate([
    {$match: {to: room}},
    {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
  ])
  return roomMessages;
}

function sortRoomMessagesByDate(messages){
  return messages.sort(function(a, b){
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[2] + date1[0] + date1[1]
    date2 =  date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1
  })
}

// socket connection

io.on('connection', (socket)=> {
  console.log('A user connected with socket ID:', socket.id)

  socket.on('new-user', async ()=> {
    console.log('Socket event: new-user')
    const members = await User.find();
    io.emit('new-user', members);
    redisClient.setex('users', JSON.stringify(members));
  })

  socket.on('join-room', async(newRoom, previousRoom)=> {
    console.log('Socket event: join-room. newRoom:', newRoom, 'previousRoom:', previousRoom)
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit('room-messages', roomMessages)
  })

  socket.on('message-room', async(room, content, sender, time, date) => {
    console.log('Socket event: message-room. room:', room, 'content:', content, 'sender:', sender, 'time:', time, 'date:', date)
    const newMessage = await Message.create({content, from: sender, time, date, to: room});
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit('room-messages', roomMessages);
    socket.broadcast.emit('notifications', room);
    redisClient.set(room, JSON.stringify(roomMessages), (err, reply) => { if (err) throw err; });
  })

  app.delete('/logout', async(req, res)=> {
    try {
      const {_id, newMessages} = req.body;
      console.log('Received logout request for user with ID:', _id);
      const user = await User.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      console.log('User status and new messages updated in the database');
      const members = await User.find();
      console.log('Retrieved all members from the database:', members);
      socket.broadcast.emit('new-user', members);
      console.log('Broadcasted new-user event to all sockets');
      res.status(200).send();
    } 
    catch (e) {
      console.log('An error occurred:', e);
      res.status(400).send()
    }
  })
})



app.get('/rooms', (req, res)=> {
  console.log('rooms request received')
  res.json(rooms)
})


server.listen(PORT, ()=> {
  console.log('listening to port', PORT)
})
