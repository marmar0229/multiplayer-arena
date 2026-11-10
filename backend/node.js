const express = require('express')
const cors = require('cors')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const http = require('http')
const {Server} = require('socket.io')

// web sock backend combine and save hhtp and app connect sockets  server  to http server with
require('dotenv').config()
app.use(express.json())
app.use(cors())
const server = http.createServer(app)

const io = new Server(server,{
cors:{
  origin: "*",
}
})
let activePlayers = {}
 io.on('connection',(socket)=>{
  activePlayers[socket.id]= {
    x:100,
    y:100,
    user : '',
    

  }
  socket.on('playermove',(data)=>{
   
      socket.broadcast.emit('playermove', { 
      id: socket.id, 
      data // <-- We send the updated server entry!
    })
    if(activePlayers[socket.id]){
       activePlayers[socket.id].x = data.x
       activePlayers[socket.id].y = data.y
    activePlayers[socket.id].up = data.up
    activePlayers[socket.id].down = data.down
    activePlayers[socket.id].user = data.user

  

   io.emit('receiveplayerinfo',(activePlayers))

    }
  })
  console.log(`socketing ${socket.id}`)
  socket.on('move',(data)=>{
    socket.broadcast.emit('move',{id:socket.id,data})
  })
socket.on('grow',(data)=>{
socket.broadcast.emit('grow',{id:socket.id,data})
})
socket.on('eatfood',(data)=>{
  socket.broadcast.emit('eatfood',{id:socket.id,data})

})

socket.on('disconnect', () => {
  delete activePlayers[socket.id]
  io.emit('receiveplayerinfo', activePlayers)
})
 })
async function connectDb(){
  try{
 await mongoose.connect(process.env.Mong)
 console.log('db running')
} catch (error) {
    console.error('db failed to load',error.message)
    
}  
}
connectDb()

// receive token wen it is received it is in header an in bearer token use split(' ')[1]
// save it and wen we receive  it  check if the received is equal to the signed  one 
async function authToken(req,res,next){
  const headerTokenGet = req.headers['authorization']
  console.log(`rawtoken test ${headerTokenGet}`)
  const seperatedToken = headerTokenGet.split(' ')[1]
  const checkToken = jwt.verify(seperatedToken,process.env.Math)
  if (checkToken){
    next()
  } else {
    res.status(400).json({response:'token is wrong'})
  }

}

server.listen(process.env.PORT || 3000,()=>{
    console.log('server listened')
})
const mongSchema = new mongoose.Schema({
    user: {
        type:String,
        required: true,
        minlength: [6,'user must b 6 or more characters'],
        maxlength: [14, 'too much']

    },
    pass:{
        type:String,
        required:true,
        minlength: [6,'user must b 6 or more characters'],
    },
    highestScore : Number
}) // click login // add pass // give jwt //send back check ext if good
const Model = mongoose.model('Model',mongSchema)
app.post('/createuser',async (req,res)=>{
console.log(req.body.user)

const hashpass = await bcrypt.hash(req.body.pass,10)
await Model.create({user:req.body.user,pass:hashpass})
console.log(await Model.find())

//res.json({token:token})

})
// find way to et hash to compare
// use user to find full db thingy array compare the hash to 
//the other thingy in compare
// give it a jwt then 
app.post('/login', async (req, res) => {
  console.log("login request", req.body)
  // 1. Wrap the entire boundary interaction in a try/catch
  try {
    const user = req.body.user
    const password = req.body.pass

    // 2. Switched to findOne so it returns the user directly instead of an array []
    const fullCredentials = await Model.findOne({ user: user })
    console.log("LOGIN USER:", user)
console.log("FOUND USER:", fullCredentials)

    // 3. Check if the user even exists before reading their password!
    if (!fullCredentials) {
      return res.status(404).json({ message: 'User not found' })
    }

    const usersFoundPass = fullCredentials.pass
    const arePassSame = await bcrypt.compare(password, usersFoundPass)

    if (arePassSame) {
      const token = jwt.sign({ user: req.body.user }, process.env.Math)
      return res.json({ token: token, user:user })
    } else {
      return res.status(401).json({ message: 'wrong pass' })
    }

  } catch (error) {
    // 4. If the database crashes, your server stays alive and handles the error gracefully
    console.error("Login route error:", error.message)
    return res.status(500).json({ message: 'Internal server error' })

  }
})

// receive log hash pass if pass is correct 
// send token recive back then check auth with authmiddleware


// wen someone logs in send there info send info or sum to track them 
// have  there  user near them maybe make a canvas paragragh at  same positio as them or  near 
// send user some else to another route to hold it then send  to wa ever route request it  i changed the bottom one the  one that was the fucking problem
