import "../App.css";
import Peer from "peerjs";
// import { HtmlHTMLAttributes }from 'react';
import { useState } from "react";
// import { MouseEventHandler } from 'react';
import { ChangeEvent } from "react";
import { useEffect } from "react";


export default async function VideoCall() {
  const [serverUrl, setServerUrl] = useState(
    "http://localhost:9000/peerjs/myVideoApp"
  );
  const [destId, setDestId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  let peerId: string;
  const peer = new Peer();

  useEffect(() => {
    peer.on("open", (id) => {
      console.log(`Peer id: ${id}`);
      peerId = id;
    });
  }, []);
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
  function handleDestChange(e: ChangeEvent<HTMLInputElement>) {
    setDestId(e.target.value);
  }
  //   function Call(destId: string, message: string) {
  //     try {
  //       const conn = peer.connect(destId);
  //       conn.on("open", function () {
  //         //receive messages
  //         conn.on("data", (data) => {
  //           console.log(`${data}`);
  //         });
  //         //send messages
  //         conn.send(message);
  //       });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }

  const constraints = {
    audio: true,
    video: {
      width: 1280,
      height: 720,
    },
  };
  async function getMedia(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  }

  async function VideoCall(destId: string) {
    const stream: MediaStream = await getMedia();
    try {
      const call = peer.call(destId, stream);
      call.on("stream", (stream) => {
        //this received stream is of the peer's
        // const video = stream.getVideoTracks();
        const audio = new Audio();
        audio.autoplay = true;
        audio.srcObject = stream;
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        console.log(videoTrack.readyState);
        console.log(audioTrack.readyState);
        const videoElement: HTMLMediaElement = document.getElementById("localVideo");
        videoElement.srcObject = videoTrack;
      });
    } catch (e) {
      console.log(e);
    }
    //on receiving call
    peer.on("call", (call) => {
      try {
        call.answer(stream);
      } catch (e) {
        console.log(e);
      }
    });
  }

  return (
    <div>
      <form>
        <label htmlFor="destId">Destination Id: </label>
        <input
          onChange={handleDestChange}
          type="text"
          name="destId"
          id="destId"
          placeholder="Destination ID"
        />
      </form>
      <div>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            e.stopPropagation();
            VideoCall(destId);
            console.log(message);
          }}
        >
          <label htmlFor="message">
            Message:
            <input
              type="text"
              name="message"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setMessage(e.target.value);
              }}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div>
        <video id="video1">
            
        </video>
      </div>
    </div>
  );
}
