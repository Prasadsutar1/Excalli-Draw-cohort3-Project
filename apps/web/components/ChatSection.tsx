import axios from "axios"
import { BACKEND_URL } from "../app/config"
import ChatRoomClient from "./ChatRoomClient";

async function getChat(roomId : string){
    console.log(`roomid is ${roomId}`);
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return response.data.messages;
}

export default async function ChatSection({id} : {
    id : string
}){
    const roomId = id;
   
    const messages = await getChat(roomId);
    return <ChatRoomClient id={id} messages={messages} />

}