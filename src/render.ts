import {desktopCapturer,remote} from 'electron'
import * as writeFile from 'fs'

//Variables
const {Menu, dialog} = remote;
var startButtonState: boolean = false;
let mediaRecorder:any;
const recordedChunks:BlobPart[] = [];

//Buttons 
const videoElement= document.querySelector('video');
const startBtn = document.getElementById("startBtn");
const videoSelect = document.getElementById("videosource");

startBtn.onclick = e => {
    if(!startButtonState){
        mediaRecorder.start();
        startBtn.innerText = 'Stop';
        startButtonState = true;

        startBtn.classList.remove("start-button");
        startBtn.classList.add("stop-button");
    }
    else{
        mediaRecorder.stop();
        startBtn.innerText = 'Start';
        startButtonState = false;

        startBtn.classList.add("start-button");
        startBtn.classList.remove("stop-button");
    }
};

videoSelect!.onchange = async (e) => {
    var selection: any = e.target;
    await selectSource(selection.value);
}


desktopCapturer.getSources({
    types: ['window', 'screen']
}).then(result => {
    result.forEach(source => {
        let option = document.createElement("option");
        option.text = source.name
        option.value = source.id
        videoSelect.appendChild(option);

        if(source.name === "Entire Screen"){
            selectSource(source.id);
        }
    });
});

async function selectSource(id: any){
    const constraints:any = {
        audio:false/*{
            mandatory:{
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: id,
            }
        }*/,
        video:{
            mandatory:{
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: id,
                minWidth: 1280,
                minHeight: 1280,
            }
        }
    };

    const mediaDevices = navigator.mediaDevices as any;

    const stream = await mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    videoElement.play();

    const options:any = {MimeType: 'video/mp4; codecs=vp9'};
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
}

function handleDataAvailable(e:any){
    recordedChunks.push(e.data);
}

async function handleStop(e:any){
    const blob = new Blob(recordedChunks, {
        type:'video/mp4; codecs=vp9'
    });

    const buffer = Buffer.from(await blob.arrayBuffer());

    const {filePath} = await dialog.showSaveDialog({
        buttonLabel: 'Save video',
        defaultPath: `vid-${Date.now()}.mp4`
    });

    writeFile.writeFile(filePath, buffer, () => console.log('video saved successfully!'));

}