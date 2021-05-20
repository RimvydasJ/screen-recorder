"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var electron_1 = require("electron");
var Menu = electron_1.remote.Menu, dialog = electron_1.remote.dialog;
var writeFile = require("fs");
//Buttons 
var videoElement = document.querySelector('video');
var startBtn = document.getElementById("startBtn");
startBtn.onclick = function (e) {
    mediaRecorder.start();
    startBtn.classList.add('is-danger');
    startBtn.innerText = 'Recording';
};
var stopBtn = document.getElementById("stopBtn");
stopBtn.onclick = function (e) {
    mediaRecorder.stop();
    startBtn.classList.remove('is-danger');
    startBtn.innerText = 'Start';
};
var videoSelectBtn = document.getElementById("videoSelectBtn");
videoSelectBtn.onclick = getVideoSrouces;
//Get the available video sources
function getVideoSrouces() {
    return __awaiter(this, void 0, void 0, function () {
        var inputSources, videoOptionsMenu;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, electron_1.desktopCapturer.getSources({
                        types: ['window', 'screen']
                    })];
                case 1:
                    inputSources = _a.sent();
                    videoOptionsMenu = Menu.buildFromTemplate(inputSources.map(function (source) {
                        return {
                            label: source.name,
                            click: function () { selectSource(source); }
                        };
                    }));
                    videoOptionsMenu.popup();
                    return [2 /*return*/];
            }
        });
    });
}
var mediaRecorder;
var recordedChunks = [];
function selectSource(source) {
    return __awaiter(this, void 0, void 0, function () {
        var constraints, mediaDevices, stream, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videoSelectBtn.innerText = source.name;
                    constraints = {
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source.id
                            }
                        }
                    };
                    mediaDevices = navigator.mediaDevices;
                    return [4 /*yield*/, mediaDevices.getUserMedia(constraints)];
                case 1:
                    stream = _a.sent();
                    videoElement.srcObject = stream;
                    videoElement.play();
                    options = { MimeType: 'video/webm; codecs=vp9' };
                    mediaRecorder = new MediaRecorder(stream, options);
                    mediaRecorder.ondataavailable = handleDataAvailable;
                    mediaRecorder.onstop = handleStop;
                    return [2 /*return*/];
            }
        });
    });
}
function handleDataAvailable(e) {
    console.log("video data available");
    recordedChunks.push(e.data);
}
function handleStop(e) {
    return __awaiter(this, void 0, void 0, function () {
        var blob, buffer, _a, _b, filePath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    blob = new Blob(recordedChunks, {
                        type: 'video/webm; codecs=vp9'
                    });
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, blob.arrayBuffer()];
                case 1:
                    buffer = _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, dialog.showSaveDialog({
                            buttonLabel: 'Save video',
                            defaultPath: "vid-" + Date.now() + ".webm"
                        })];
                case 2:
                    filePath = (_c.sent()).filePath;
                    writeFile.writeFile(filePath, buffer, function () { return console.log('video saved successfully!'); });
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=render.js.map