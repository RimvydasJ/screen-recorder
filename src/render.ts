import {desktopCapturer,remote} from 'electron'
const {Menu, dialog} = remote;
import * as writeFile from 'fs'
//Buttons 
const videoElement= document.querySelector('video');
const startBtn = document.getElementById("startBtn");
startBtn.onclick = e => {
    mediaRecorder.start();
    startBtn.classList.add('is-danger');
    startBtn.innerText = 'Recording';
  };
const stopBtn = document.getElementById("stopBtn");
stopBtn.onclick = e => {
    mediaRecorder.stop();
    startBtn.classList.remove('is-danger');
    startBtn.innerText = 'Start';
  };
const videoSelectBtn = document.getElementById("videoSelectBtn");
videoSelectBtn!.onclick = getVideoSrouces;


//Get the available video sources
async function getVideoSrouces() {
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });


    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label:source.name,
                click:() => {selectSource(source)}
            }
        })
    );

    videoOptionsMenu.popup();
}


let mediaRecorder:any;
const recordedChunks:BlobPart[] = [];

async function selectSource(source:Electron.DesktopCapturerSource){
    videoSelectBtn.innerText = source.name;

    const constraints:any = {
        audio:false,
        video:{
            mandatory:{
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
            }
        }
    };

    const mediaDevices = navigator.mediaDevices as any;

    const stream = await mediaDevices.getUserMedia(constraints);

    videoElement.srcObject = stream;
    videoElement.play();

    const options:any = {MimeType: 'video/webm; codecs=vp9'};
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
}

function handleDataAvailable(e:any){
    console.log("video data available");
    recordedChunks.push(e.data);
}

async function handleStop(e:any){
    const blob = new Blob(recordedChunks, {
        type:'video/webm; codecs=vp9'
    });

    const buffer = Buffer.from(await blob.arrayBuffer());

    const {filePath} = await dialog.showSaveDialog({
        buttonLabel: 'Save video',
        defaultPath: `vid-${Date.now()}.webm`
    });

    writeFile.writeFile(filePath, buffer, () => console.log('video saved successfully!'));

}