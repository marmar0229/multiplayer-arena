// e.prevet default then get form data then .get to go in both 
// use fetch to send to backend passwords
// create backend express etc routes jwt auth  

import React from "react"
import { useState } from "react"
import CanvasContainer from "./CanvasContainer" // Make sure this matches your canvas filename
export default function App (){

  const [loggedInUser, setLoggedInUser] = useState<string | null>(null)
  const [routeVariable, changeRouteVariable] = useState('')

  function preventDefault(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const user = formData.get('user')
    const pass = formData.get('pass')

    if (routeVariable === '/createuser') {
      const receiveToken = async () => {
        try {
          const response = await fetch(routeVariable, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: user, pass: pass })
          })
          console.log(response)

          if (response.ok) {
            const token = await response.json()
            fetch('/createuser', {
              headers: {
                'Authorization': `Bearer ${token.token}`
              }
            })
          }
        } catch (error) {
          console.error("Account creation network error:", error)
          alert("Server connection failed during account creation.")
        }
      }
      receiveToken()
    } else {
      const runLogin = async () => {
        // ✅ FULL FIX: Added try/catch to protect against network drops and server crashes
        try {
          const response = await fetch(routeVariable, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: user, pass: pass })
          })

          if (response.ok) {
            // 📦 SENDING THE PROP:
            const usergot = await response.json()
            setLoggedInUser(usergot.user)
          } else {
            // Handles bad passwords or usernames gracefully instead of hanging
            alert("Invalid username or password.")
           
          }
          console.log(response)

        } catch (error) {
          console.error("Network error during login:", error)
          alert("Could not connect to the server. Please check your network connection.")
        }
      }

      runLogin()
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      
      {/* ✅ FULL FIX: Conditional swap block. If a user is logged in, show the canvas. Otherwise, show the login form. */}
      {loggedInUser ? (
        <CanvasContainer user={loggedInUser} />
      ) : (
        <form onSubmit={preventDefault}>
          <label htmlFor="user">
            <p>user</p>
            <input maxLength={14} minLength={6} name="user" id="user" />
          </label>
          
          <label htmlFor="pass">
            <p>pass</p>
            <input maxLength={14} minLength={6} type="password" name="pass" id="pass" />
          </label>
          <br /><br />
          
          <button onClick={() => { changeRouteVariable('/createuser') }} type="submit">
            <p>create</p>
          </button>   
          
          <button onClick={() => { changeRouteVariable('/login') }} type="submit">
            <p>login</p>
          </button>
        </form>
      )}
 
    </div>
  )
}
