import { useState } from "react"
import { useRef, useEffect } from "react"
import { io } from "socket.io-client"
const socket  = io('http://localhost:3000')
// everytime player collides with food in if statement add plius 1 to state or reg variable see if u ca
// make more than 2 food appear when food is eaten  cause render 
export default function CanvasContainer({ user }: { user: string }) {
    const [foodArray, setFoodArray] = useState<{ x: number, y: number }[]>([
        { x: 100, y: 150 }, 
        { x: 400, y: 300 },
        { x: 400, y: 100 }, 
    ])
      
    const [x, changex] = useState(Math.random() * 800)
    const [y, changey] = useState(Math.random() * 500)
    const [up, changeUp] = useState(12)
    const [down, changeDown] = useState(11)
    const [score, changeScore] = useState(0)
    const [scoreHigh,changeScoreHigh] = useState(0)
       
    const reffy = useRef<HTMLCanvasElement | null>(null)
    const [playerdata, setPlayerdata] = useState({})
    useEffect(() => {
        socket.on('receiveplayerinfo',(data)=>{
         setPlayerdata(data)
        })
        const canvas = reffy.current

        if (!canvas) return
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
        if (!ctx) return 

        console.log('canvas is ready to draw')
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = 'black'
        ctx.fillRect(x, y, up, down)
        ctx.fillStyle = 'blue'

Object.entries(playerdata).forEach(([id,player]:any) => {
    if(id!== socket.id){
    ctx.fillRect(player.x, player.y, player.up, player.down)
    ctx.fillText(player.user, player.x, player.y - 5)

    if (
        x < player.x + player.up &&
        x + up > player.x &&
        y < player.y + player.down &&
        y + down > player.y
    ) {
        if (player.up > up) {
            changeUp(12)
            changeDown(11)
            changeScore(0)
        }
    }


    }
})

        foodArray.forEach((food) => {
            ctx.fillStyle = 'red' 
            ctx.fillRect(food.x, food.y, 8, 8) 
        })
    
        ctx.fillText(user, x, y - 5)

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'a') {
                changex((current) => current - 10) 
            } else if (e.key === 'd') {
                changex((current) => current + 10) 
            } else if (e.key === 's') {
                changey((current) => current + 10) 
            } else if (e.key === 'w') { 
                changey((current) => current - 10) 
            }
        } 

        foodArray.forEach((food) => {
            if (
                x < food.x + 8 &&    
                x + up > food.x &&   
                y < food.y + 8 &&    
                y + down > food.y    
            ) {
                changeUp((currentWidth) => currentWidth + 0.8)  
                changeDown((currentHeight) => currentHeight + 0.8) 
                setFoodArray((currentList) => currentList.filter((item) => item !== food))
                setFoodArray((currentList) => [
                    ...currentList.filter((item) => item !== food),
                    {
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height
                    }
                ])
                socket.emit('eatfood', { x: food.x, y: food.y })
                changeScore((currentScore) => {
                    const newScore = currentScore + 1
                
                    if (newScore > scoreHigh) {
                        changeScoreHigh(newScore)
                    }
                
                    return newScore
                })
            }
        })

        window.addEventListener('keydown', handleKeyDown)
            



        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }

    }, [x, y, up, down, foodArray, user,playerdata ]) 
    // 🔌 The All-In-One Player Sync Hook
useEffect(() => {
    socket.emit('playermove', { x, y, up, down,user })
}, [x, y, up, down]) 

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>your  score {score}</p>
            <p>highest score {scoreHigh}</p>
     


          <canvas  
              ref={reffy}
              width={1000}
              height={600}
              style={{ border: '1px solid black' }} 
          />
        </div>
    )
}
//uneffected
