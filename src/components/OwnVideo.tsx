export default function OwnVideo(){
    const mediaConstraints = {
        audio: true,
        video: {
            width: 1280,
            height: 720
        }
    };
    document.querySelector('#showVideo')?.addEventListener('click',((e)=>Initialize(e)));
    async function captureMediaDevices(){
        return await navigator.mediaDevices.getUserMedia(mediaConstraints);
    }
    async function Initialize(e) {
        try {
            console.log("Reached this point");
            const stream = await captureMediaDevices();
            if(stream){
                console.log("Stream created");
            }
            attachVideoStream(stream);
            e.target.disabled = true;
        }
        catch(e){
            console.error(e);
        }
    }
    function attachVideoStream(stream: MediaStream){
        const videoElement = document.querySelector('#video');
        if(videoElement){
            videoElement.srcObject = stream;
        }
    }

    return (
        <div>
            <button id="showVideo">Webcam Video</button>
            <video id="video" content={"width: 720px"} autoPlay playsInline></video>
        </div>
    )
}