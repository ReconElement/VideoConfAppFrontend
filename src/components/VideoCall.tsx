import '../App.css';
import Peer from 'peerjs';
import {MouseEventHandler, useEffect, useState} from 'react';
import {ChangeEvent} from 'react';

export default function VideoCall() {
    const [destId, setDestId] = useState<string>('');
    const [peerId, setPeerId] = useState<string>('');
    const peer = new Peer();
    let peerStream: MediaStream | null = null;
    useEffect(()=>{
        peer.on("open",(id)=>{
            setPeerId(id);
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
            console.log("Peer video stream is received");
            attachVideoStream(peerStream);
        }
    });
    const videoElement = document.querySelector('#video');
    function handleDestChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setDestId(e.target.value);
    }
    async function videoCall(e: MouseEvent) {
        e.preventDefault();
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
    //answer call
    peer.on('call',async (call)=>{
        try{
            const selfStream = await captureMediaDevices();
            call.answer(selfStream);
            call.on('stream',function(stream){
                peerStream = stream;
            })
        }
        catch(e){
            console.error(e);
        }
    })
    function attachVideoStream(stream: MediaStream){
        if(videoElement){
            videoElement.srcObject = stream;
            console.log("peer video attached to video tag");
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
