const socket = io('randonconnectlocalhost')
const players = {}
socket.on('heresallplayers',(socket)=>{
 console.log(socket)
})