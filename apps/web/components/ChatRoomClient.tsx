'use client';

import { useEffect, useState } from "react";
import { useSocket } from "../app/hooks/useSocket";

export default function ChatRoomClient( {
    messages,
    id
}:{
    messages : {message :string}[];
    id :string
}){
     const {socket , loading} = useSocket();
    const [chats, setChats] = useState(messages);
    const [currentMessage , setCurrentMessage] = useState("");
    useEffect(()=> {
        if(socket && !loading){
            socket.send(JSON.stringify({
                type : "join-room",
                roomId : id
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === "chat"){
                    setChats(c => [...c , {message :parsedData.message}]);
                }
            }
        }

        return () =>{
            socket?.close();
        }
    },[socket , loading , id])

    return <div> 
            {chats.map(m => <div>{m.message}</div>)}
            <input type="text" onChange={ (e) => {setCurrentMessage(e.target.value)}} value={currentMessage} />
            <button onClick={() => {
                socket?.send(
                    JSON.stringify({
                        type : "chat",
                        roomId : id,
                        message : currentMessage
                    })
                )
                setCurrentMessage('');
            }}>send message</button>
        </div>
}