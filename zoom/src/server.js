import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.render("/"));
// console.log("hello");
const handleListen = () => console.log(`listening on http://localhost:3000`);
// app.listen(3000);
const server = http.createServer(app);
const wwss = new WebSocketServer({ server });
const sockets = [];

wwss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", (message) => {
        const msg = JSON.parse(message);
        console.log(msg);
        switch (msg.type) {
            case "new_message":
                sockets.forEach((aSocket) =>
                    aSocket.send(
                        `${socket.nickname} : ${msg.payload.toString()}`
                    )
                );
                break;
            case "nickname":
                // console.log(msg.toString("utf-8"));
                // socket.send(msg.payload);
                socket["nickname"] = msg.payload;
                break;
        }
    });
});

server.listen(3000, handleListen);
// 3000포트에서 websocket server 와 http server를 모두 접속가능
// http위에 websocket을 구현한것..?
// Express 모듈을 사용하여 app.listen()을 실행하게 되면,
// Express는 자체적으로 http.createServer() 기능을 수행합니다.
// 다만, 최종적으로 반환되는 인스턴스는 http 객체 자체가 아닌 그 일부(컴포넌트?)입니다.
// 반면, http.createServer()는 http 인스턴스 자체를 반환합니다,
// Websocket처럼 Socket을 이용하고자 할 때는 이 http(또는 https) 인스턴스 자체가 필요하므로,
//  여기서는 Express가 아닌 내장 api인 http를 사용한 것 같습니다.
