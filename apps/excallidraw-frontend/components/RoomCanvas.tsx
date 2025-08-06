"use client";
import { initDraw } from "@/app/draw";
import { WEBSOCKET_URL } from "@/config";
import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: {
    roomId: string
}) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [socket , setSocket] = useState<WebSocket | null>(null)
    
    useEffect(()=> {
        const ws = new WebSocket(WEBSOCKET_URL);

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type : "join_room",
                roomId
            }))
        }
    },[])




    // if(!socket){
    //     return <div>
    //         connecting to server ....
    //     </div>
    // }

    return (
        <div>
            <Canvas roomId = {roomId} socket = {socket}/>
    
            <div className="absolute bottom-0 right-0">
                <button className="bg-white text-black p-2 border-2 border-amber-950 border-r-8 ">rect</button>
                <button className="bg-white text-black p-2 ">circle</button>
            </div>

        </div>
    )
}