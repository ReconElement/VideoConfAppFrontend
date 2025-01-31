import "../App.css";
import Peer from 'peerjs'
import { useEffect, useState } from "react";

export default function Video(){
    const [serverUrl, setServerUrl] = useState("http://localhost:9000/peerjs/myVideoApp");
    const peer = new Peer("1", {
        host: "localhost",
        port: 9000,
        path: "/peerjs/myVideoApp"
    });
    let peerId: string = '';
    peer.on("open",(id)=>{
        console.log(`The peer id is: ${id}`);
        peerId = id;
    });
    const conn = peer.connect('2');
    conn.on("open", function(){
        //recieved messages
        conn.on('data',function(data){
            console.log(`Recieved: ${data}`);
        });

        //send messages
        conn.send("Hello");
    });
    return(
        <div>
            Video Component
        </div>
    )
}