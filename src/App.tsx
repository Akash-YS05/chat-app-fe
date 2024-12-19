import { useEffect, useRef, useState } from 'react'
import './App.css'


function App() {

  const [messages, setMessages] = useState(["hi there", "hello"])
  const wsRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080")
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])  //spreads out the existing array, and adds the new message
    }
    wsRef.current = ws

    ws.onopen = () => {   //when the connection opens
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red" 
        }
      }))
    }
    
  }, [])

  return (
    <div className="bg-black h-screen">
      <br /><br /><br />
      <div className='h-[70vh]'>
        {messages.map(message => <div className='m-8'>
          <span className='bg-white p-2 rounded'>{message}</span>
        </div> )}
      </div>
        <div className='flex justify-center gap-4 mb-8'>
          <input ref={inputRef} className='p-4 w-[35vw] rounded-2xl' type="text" />
          <button onClick={() => {
            const message = inputRef.current?.value
            wsRef.current.send(JSON.stringify({
              type: "chat",
              payload: {
                message: message
              }
            }))
          }} className='bg-indigo-500 px-2 rounded-xl'>Send Message</button>
        </div>
      </div>
  )
}

export default App
