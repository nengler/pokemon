import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

let isEventAdded = false;

export default function MusicPlayer() {
  const router = useRouter();
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

  async function loadSound(url) {
    const audioBuffer = await fetch(url)
      .then((res) => res.arrayBuffer())
      .then((ArrayBuffer) => audioContext.current.decodeAudioData(ArrayBuffer));

    playSong(audioBuffer);
  }

  function createSource(gainNode) {
    if (sourceRef.current && audioContext.current.state === "running") {
      sourceRef.current.stop();
    }

    sourceRef.current = audioContext.current.createBufferSource();
    sourceRef.current.connect(gainNode);
    return sourceRef.current;
  }

  function getOrCreateGain() {
    if (!gainNodeRef.current) {
      gainNodeRef.current = audioContext.current.createGain();
      gainNodeRef.current.connect(audioContext.current.destination);
    }

    return gainNodeRef.current;
  }

  function playSong(buffer) {
    let gainNode = getOrCreateGain();
    let source = createSource(gainNode);

    console.log("buffer", buffer);

    source.buffer = buffer;

    source.loop = true;
    gainNode.gain.setValueAtTime(
      document.getElementById("volume-slider").value / 100,
      audioContext.current.currentTime
    );
    source.start(0);
  }

  function setAudioContext() {
    audioContext.current = new AudioContext();
  }

  function getSongFromUrl(url) {
    if (url === "/") {
      return "/assets/pokemon_center.mp3";
    } else if (url === "/how-to-play") {
      return "/assets/azalea_town.mp3";
    }
  }

  useEffect(() => {
    try {
      if (!audioContext.current) {
        setAudioContext();
        const gainNode = getOrCreateGain();
        createSource(gainNode);
      }

      if (!isEventAdded) {
        isEventAdded = true;
        document.querySelector("body").addEventListener(
          "click",
          function () {
            const songToPlay = getSongFromUrl(router.pathname);
            loadSound(songToPlay);
          },
          { once: true }
        );

        document.getElementById("volume-slider").addEventListener("change", changeVolume);
      }
    } catch (e) {
      console.log("heyo");
    }

    const handleRouteChange = (url) => {
      console.log(url);
      const songToPlay = getSongFromUrl(url);
      loadSound(songToPlay);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return <input type="range" min="0" max="100" step="1" id="volume-slider" />;
}
