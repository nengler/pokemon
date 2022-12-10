import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

let isEventAdded = false;

export default function MusicPlayer({ Component, pageProps }) {
  const router = useRouter();
  const audioContext = useRef(createAudioContext());
  const gainNodeRef = useRef(null);
  const sourceRef = useRef(null);
  const inputRange = getInputRange();

  function getInputRange() {
    if (typeof window !== "undefined") {
      return document.getElementById("volume-slider");
    }
  }

  function createAudioContext() {
    if (typeof window !== "undefined") {
      return new AudioContext();
    }
  }

  function changeVolume(event) {
    if (!audioContext.current) {
      return;
    }

    const newVolumne = parseInt(event.currentTarget.value);
    const gainNode = getOrCreateGain();
    gainNode.gain.setValueAtTime(newVolumne / 100, audioContext.current.currentTime);
    localStorage.setItem("volume", newVolumne);
  }

  async function loadSound(url, callback) {
    const audioBuffer = await fetch(url)
      .then((res) => res.arrayBuffer())
      .then((ArrayBuffer) => audioContext.current.decodeAudioData(ArrayBuffer));

    callback(audioBuffer);
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

    source.buffer = buffer;

    source.loop = true;
    const currentVolume = parseInt(inputRange.value);
    gainNode.gain.setValueAtTime(currentVolume / 100, audioContext.current.currentTime);
    source.start(0);
  }

  function playSound(buffer) {
    let gainNode = getOrCreateGain();
    let source = audioContext.current.createBufferSource();
    source.connect(gainNode);

    source.buffer = buffer;
    const currentVolume = parseInt(inputRange.value);
    gainNode.gain.setValueAtTime(currentVolume / 100, audioContext.current.currentTime);
    source.start(0);
  }

  function getSongFromUrl(url) {
    if (url === "/") {
      return "/assets/pokemon_center.mp3";
    } else if (url === "/how-to-play" || url === "/play") {
      return "/assets/azalea_town.mp3";
    }
  }

  useEffect(() => {
    try {
      if (!audioContext.current) {
        const gainNode = getOrCreateGain();
        createSource(gainNode);
      }

      if (!isEventAdded) {
        isEventAdded = true;
        document.querySelector("body").addEventListener(
          "click",
          function () {
            const songToPlay = getSongFromUrl(router.pathname);
            if (songToPlay) {
              loadSound(songToPlay, playSong);
            }
          },
          { once: true }
        );

        inputRange.addEventListener("change", changeVolume);
      }
    } catch (e) {
      console.log("heyo", e);
    }

    const handleRouteChange = (url) => {
      const songToPlay = getSongFromUrl(url, playSong);
      if (songToPlay) {
        loadSound(songToPlay, playSong);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  function getInitialVolume() {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("volume") || "50";
    }

    return "50";
  }

  const childPlaySound = (url) => {
    loadSound(url, playSound);
  };

  const childPlaySong = (url) => {
    loadSound(url, playSong);
  };

  const allProps = { ...pageProps, childPlaySound, childPlaySong };

  return (
    <>
      <Component {...allProps} />
      <input defaultValue={getInitialVolume()} type="range" min="0" max="100" step="1" id="volume-slider" />
    </>
  );
}
