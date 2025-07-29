import express from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { CreateUserSchema, RoomSchema, SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello this is the express backend");
});

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.status(400).json({
            message: "incorrect inputs"
        });
        return;
    }

    try {

        const check = await prismaClient.user.findUnique({
            where: { email: parsedData.data.email }
        })

        if (check) {
            res.status(409).json({
                message: "User Already exit with this email",
            })
            return;
        }

        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.email,
                password: await bcrypt.hash(parsedData.data.password, 5),
                name: parsedData.data.name
            }
        });
        console.log(user);
        res.status(201).json({
            message: "user is succesffuly created",
            userId: user.id,
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: e,
        })
    }
});

app.post("/signin", async (req, res) => {

    const parsedData = SigninSchema.safeParse(req.body);

    try {
        if (!parsedData.success) {
            console.error(parsedData.error);
            return;
        }

        const user = await prismaClient.user.findUnique({
            where: {
                email: parsedData.data.email
            }
        });

        if (user) {
            const checkPass = await bcrypt.compare(parsedData.data.password, user.password);
            if (!checkPass) {
                res.status(401).json({
                    message: "password is incorrect",
                });
                return;
            }
            const token = jwt.sign({
                userId: user?.id.toString()
            }, JWT_SECRET, {
                expiresIn: '10h'
            });

            res.status(200).json({
                message: "user is succesffully signed in ",
                token
            })
            return;

        } else {
            res.status(404).json({
                message: "User does not exits"
            });
        }
    } catch (e) {
        res.status(500).json({
            message: e + "some error"
        })
    }

});

app.post("/room", middleware, async (req, res) => {
    const parsedData = RoomSchema.safeParse(req.body);


    if (!parsedData.success) {
        console.error(parsedData.error);
        return;
    }
    // @ts-ignore
    const userId = req.userId;
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })

        res.json({
            roomId: room.id,
            message: "room is created"
        });
        return;
    }
    catch (e) {
        res.status(500).json({
            message: "Room Already Exits try with another room name"
        })
    }

});

app.get("/chats/:roomId" ,async (req,res) =>{
    console.log("roomid ran");
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where : {
            roomId : roomId
        },
        orderBy : {
            id : "asc"
        },
        take :50 
    });
    console.log(messages);
    console.log("send messages");
    res.json({
        messages
    })
});

app.get("/room/:slug" , async (req,res) =>{
    console.log("slug ran");
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where : {
            slug
        }
    });
    const roomid = room?.id

    res.json({
        roomid
    })
})
app.listen(3003);  