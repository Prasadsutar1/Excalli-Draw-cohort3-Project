"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId , setRoomId] = useState("");
  const router = useRouter();
  return (
    <div style={{
      display : "flex",
      justifyContent : "center",
      alignContent : "center",
      height : "100vh",
      width : "100vw",
      alignItems : "center"
    }} >
      <div>
      <input value={roomId} style={{ padding : "10px"}} placeholder="room id" onChange={(e) =>{
          setRoomId(e.target.value);
        }} type="text" />

        <button style={{padding : "10px" , margin : "2px"}} onClick={() =>{
          router.push(`/room/${roomId}`)
        }}> Join Room </button>
      </div>
        
    </div>
  );
}
