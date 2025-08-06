"use client";
import { initDraw } from "@/app/draw";
import { useEffect, useRef } from "react";

export default function Canvas({roomId,socket} :{roomId :string
    ,socket : WebSocket | null
} ){
      const canvasRef = useRef<HTMLCanvasElement>(null);   
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            initDraw(canvas, roomId, socket);
        }
    }, [canvasRef])

    return <div>
        <canvas ref={canvasRef} width={1535} height={700}></canvas>
    </div>
}