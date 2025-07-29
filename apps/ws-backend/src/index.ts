import { WebSocketServer, WebSocket  } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });
import { prismaClient } from "@repo/db/client"

interface User {
    ws: WebSocket,
    rooms: String[],
    userId: String
};

const users: User[] = [];

function checkUser(token: string): string | null {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
        console.log("string");
        return null;
    }

    if (!decoded || !decoded.userId) {
        console.log("2nd ran");
        return null;
    }

    return decoded.userId;

}

wss.on("connection", (ws, request) => {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    console.log(token);
    const userId = checkUser(token);
    console.log(userId);
    if (!userId || userId == null) {
        ws.send("authentication failed");
        ws.close();
        return;
    }

    users.push({
        userId,
        rooms : [],
        ws
    })

    ws.on("message", async (data) => {
        const parsedData = JSON.parse(data as unknown as string);

        if(parsedData.type == "join-room"){
            const user = users.find(x => x.ws === ws);
            user?.rooms.push(parsedData.roomId);
        }

        if(parsedData.type == "leave-room"){
            const user = users.find(x => x.ws === ws);
            if(!user){
                return;
            }
           user.rooms = user?.rooms.filter(x => x === parsedData.room); 
        }

        if(parsedData.type == "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            await prismaClient.chat.create({
                data : {
                    roomId,
                    message,
                    userId
                }
            })
            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type : "chat",
                        message :message,
                        roomId
                    }))
                }
            })
        }
    });

    ws.on("error", console.error);

    ws.send("something");
});
