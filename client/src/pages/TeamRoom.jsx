import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

const socket = io('http://localhost:4000')

export default function TeamRoom(){
  const { id } = useParams()
  const [messages,setMessages]=useState([])
  const [text,setText]=useState('')

  useEffect(()=>{
    socket.emit('join-room',{roomId:id,userId:'demoUser'})
    socket.on('team-message', msg => {
      setMessages(prev=>[...prev,msg])
    })
    return ()=>{
      socket.off('team-message')
    }
  },[id])

  const send = ()=>{
    socket.emit('team-message',{roomId:id,message:text,from:'demoUser'})
    setText('')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Team Room {id}</h2>
      <div className="border p-4 h-80 overflow-y-auto bg-white rounded mb-4">
        {messages.map((m,i)=><div key={i} className="text-sm mb-2"><span className="font-semibold">{m.from}:</span> {m.message}</div>)}
      </div>
      <div className="flex space-x-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 p-2 border rounded" />
        <button onClick={send} className="bg-green-600 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  )
}
