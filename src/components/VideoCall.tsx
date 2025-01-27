import '../App.css';
import Peer from 'peerjs';
import {MouseEventHandler, useState} from 'react';
import {useEffect} from 'react';
import {ChangeEvent} from 'react';

export default function VideoCall() {
    const [destId, setDestId] = useState<string>('');
    let peerId: string | null = null;
    const peer = new Peer();
    let peerStream: MediaStream | null = null;
    useEffect(()=>{
        peer.on("open",(id)=>{
            peerId = id;
        });
    },[]);
    const mediaConstraints = {
        video: {
            height: 720,
            width: 1280
        },
        audio: true
    };
    async function captureMediaDevices(){
        return await navigator.mediaDevices.getUserMedia(mediaConstraints);
    }
    document.querySelector('#streamVideo')?.addEventListener('click',()=>{
        if(peerStream){
            attachVideoStream(peerStream);
        }
    })
    function handleDestChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setDestId(e.target.value);
    }
    async function videoCall() {
        try{
            const selfStream = await captureMediaDevices();
            const call = peer.call(destId, selfStream);
            call.on('stream',function(stream){
                peerStream = stream
            });
        }
        catch(err){
            console.error(err);
        }
    }
    ///TODO: Add something that deals with what happens when we receive a video call 
    function attachVideoStream(stream: MediaStream){
        const videoElement = document.querySelector('#video');
        if(videoElement){
            videoElement.srcObject = stream;
        }
    }
    return(
        <div>
            <h1>Current Peer Id: {peerId?peerId:"loading..."}</h1>
            <div>
                <form>
                    <label htmlFor="destId">
                        <input type="text" onChange={handleDestChange} id="destId" name={"destId"} placeholder="Destination ID" />
                    </label>
                    <button type="submit" onClick={videoCall}>VideoCall</button>
                </form>
                <button id={"streamVideo"} disabled={!peerStream}>
                    Click here to view stream!
                </button>
                <video src="" id="video"></video>
            </div>
        </div>
    )
}
