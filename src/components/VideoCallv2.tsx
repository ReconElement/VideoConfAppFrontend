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
    const videoElement: HTMLVideoElement | null= document.querySelector('video');
    document.querySelector('#streamVideo')?.addEventListener('click',()=>{
        // console.log(peerStream?.active);
        if(peerStream){
            attachVideoStream(peerStream);
        }
    })
    function handleDestChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setDestId(e.target.value);
    }
    async function videoCall(e: MouseEvent) {
        e.preventDefault();
        try{
            const selfStream = await captureMediaDevices();
            let call;
            if(selfStream?.active){
                call = await peer.call(destId, selfStream);
            }
            call?.on('stream',async function(stream){
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
            call.on('stream',async function(stream){
                // peerStream = stream;
                console.log(stream?.active);
                if(stream?.active){
                    peerStream = stream;
                }
            })
            call.answer(selfStream);
        }
        catch(e){
            console.error(e);
        }
    })
    function attachVideoStream(stream: MediaStream){
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
                    <button type="submit" onClick={videoCall} >VideoCall</button>
                </form>
                <button id={"streamVideo"} >
                    Click here to view stream!
                </button>
                <video src="" id="video" autoPlay playsInline></video>
            </div>
        </div>
    )
}
