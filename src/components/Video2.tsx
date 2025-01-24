import '../App.css';
import Peer from 'peerjs';
import {useState} from 'react';

export default function Video2(){
    const [serverUrl, setServerUrl] = useState("http://localhost:9000/peerjs/myVideoApp");
    const peer = new Peer('2',{
        host: "localhost",
        port: 9000,
        path: "peerjs/myVideoApp"
    });
    let peerId: string = ' ';
    peer.on('open',(id)=>{
        peerId = id;
        console.log(`The peer id is ${id}`);
    });
    peer.on('connection',(conn)=>{
        //recieve messages
        conn.on("data",(data)=>{
            console.log(`Recieved message: ${data}`);
            if(data==="Hello"){
                conn.send("Hi there");
            }
        });
        //send message

    });
    return(
        <div>
            Video Component 2
        </div>
    )
}