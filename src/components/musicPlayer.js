import { useEffect, useRef, useState } from "react";

let isEventAdded = false;

export default function MusicPlayer() {
  const audioContext = useRef(null);
  const sourceRef = useRef(null);
  const gainNodeRef = useRef(null);

  function changeVolume(event) {
    if (!audioContext.current) {
      return;
    }

    const newVolumne = parseInt(event.currentTarget.value);
    const gainNode = getOrCreateGain();
    gainNode.gain.setValueAtTime(newVolumne / 100, audioContext.current.currentTime);
  }

  function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function () {
      audioContext.current.decodeAudioData(request.response, playSong, onError);
    };
    request.send();
  }

  function getOrCreateSource() {
    if (!sourceRef.current) {
      sourceRef.current = audioContext.current.createBufferSource();
    }

    return sourceRef.current;
  }

  function getOrCreateGain(source) {
    if (!gainNodeRef.current) {
      gainNodeRef.current = audioContext.current.createGain();
      source.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContext.current.destination);
    }

    return gainNodeRef.current;
  }

  function playSong(buffer) {
    let source = getOrCreateSource();
    let gainNode = getOrCreateGain(source);

    source.buffer = buffer;

    source.loop = true;
    gainNode.gain.setValueAtTime(0.5, audioContext.current.currentTime);
    source.start();
  }

  function onError(e) {
    console.log(e);
  }

  function setAudioContext() {
    audioContext.current = new AudioContext();
  }

  useEffect(() => {
    try {
      if (!audioContext.current) {
        setAudioContext();
        let source = getOrCreateSource();
        getOrCreateGain(source);
      }

      if (!isEventAdded) {
        isEventAdded = true;
        document.querySelector("body").addEventListener(
          "click",
          function () {
            audioContext.current.resume().then(() => {
              loadSound("/assets/pokemon_center.mp3");
            });
          },
          { once: true }
        );

        document.getElementById("volume-slider").addEventListener("change", changeVolume);
      }
    } catch (e) {
      console.log("heyo");
    }
  }, []);

  return <input type="range" min="0" max="100" step="1" id="volume-slider" />;
}
