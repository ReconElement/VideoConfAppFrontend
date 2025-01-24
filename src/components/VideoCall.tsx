import '../App.css';
import Peer from 'peerjs';
// import { HtmlHTMLAttributes }from 'react';
import {useState} from 'react';
// import { MouseEventHandler } from 'react';
import { ChangeEvent } from 'react';
import { useEffect } from 'react';

export default function VideoCall(){
    const [serverUrl, setServerUrl] = useState("http://localhost:9000/peerjs/myVideoApp");
    const [destId, setDestId] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    let peerId: string;
    const peer = new Peer();

    useEffect(()=>{
        peer.on('open',(id)=>{
            console.log(`Peer id: ${id}`);
            peerId = id;
        })
    },[destId])
    //to call
    // function Call(conn: Peer, destId: string){
    //     conn.on('open',()=>{
    //         //Receive messages
    //         conn.on('data', (data)=>{
    //             console.log(`Received: ${data}`);
    //         });
    //     })
    // }
    // function establishConn(destId: string): Peer{
    //     const conn = peer.connect(destId);
    //     return conn;
    // }
    function handleDestChange(e: ChangeEvent<HTMLInputElement>){
        setDestId(e.target.value);
    }
    function Call(destId: string, message: string){
        const conn = peer.connect(destId);
        conn.on('open',function(){
            //receive messages
            conn.on('data',(data)=>{
                console.log(`${data}`);
            });
            //send messages
            conn.send(message);
        })
    };
    peer.on('connection',(conn)=>{
        //receive messages
        conn.on('data',(data)=>{
            console.log(`${data}`);
        });
        //send messages
        conn.send("Default message to tell you that I received your connection");
    });
    return(
        <div>
            <form>
                <label htmlFor="destId">Destination Id: </label>
                <input onChange={handleDestChange} type="text" name="destId" id="destId" placeholder='Destination ID' />
            </form>
            <div>
                <form onSubmit={(e: SubmitEvent<HTMLFormElement>)=>{Call(destId, message)}}>
                    <label htmlFor="message">Message: 
                    <input type="text" name="message" onChange={(e: ChangeEvent<HTMLInputElement>)=>{
                        setMessage(e.target.value);
                    }}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    )
}