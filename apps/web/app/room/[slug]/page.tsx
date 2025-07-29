import axios from "axios";
import { BACKEND_URL } from "../../config";
import ChatSection from "../../../components/ChatSection";

async function getRoom(slug :string){
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`); 
    console.log(response.data.roomid);
    return response.data.roomid;
}

export default async function ChatRoom({params} : {params : {slug : string}}){
    const slug = (await params).slug;
    const roomId = await getRoom(slug);

    return <ChatSection id={roomId}/>
    
}