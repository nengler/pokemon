import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

let isEventAdded = false;

export default function MusicPlayer({ Component, pageProps }) {
  const router = useRouter();
  const audioContext = useRef(createAudioContext());
  const gainNodeRef = useRef(null);
  const sourceRef = useRef(null);
  const inputRange = getInputRange();
  const audioSongs = useRef([
    { name: "victory", buffer: null, didFetch: false, url: "/assets/victory.mp3" },
    { name: "defeat", buffer: null, didFetch: false, url: "/assets/defeat.mp3" },
    { name: "tie", buffer: null, didFetch: false, url: "/assets/tie.mp3" },
    { name: "center", buffer: null, didFetch: false, url: "/assets/pokemon_center.mp3" },
    { name: "azalea", buffer: null, didFetch: false, url: "/assets/azalea_town.mp3" },
    { name: "gym_battle_1", buffer: null, didFetch: false, url: "/assets/gym_battle_1.mp3" },
    { name: "gym_battle_3", buffer: null, didFetch: false, url: "/assets/gym_battle_3.mp3" },
  ]);

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

  function playSong(buffer, shouldLoop = true) {
    let gainNode = getOrCreateGain();
    let source = createSource(gainNode);

    source.buffer = buffer;

    source.loop = shouldLoop;
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
      return "center";
    } else if (url === "/how-to-play" || url === "/play") {
      return "azalea";
    }
  }

  async function preloadSong(songObject) {
    audioSongs.current = audioSongs.current.map((a) => {
      if (songObject.name === a.name) {
        return { ...a, didFetch: true };
      }

      return a;
    });

    const audioBuffer = await fetch(songObject.url)
      .then((res) => res.arrayBuffer())
      .then((ArrayBuffer) => audioContext.current.decodeAudioData(ArrayBuffer));

    audioSongs.current = audioSongs.current.map((a) => {
      if (songObject.name === a.name) {
        return { ...a, buffer: audioBuffer };
      }

      return a;
    });
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
              loadOrPlaySong(songToPlay);
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
        loadOrPlaySong(songToPlay);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    audioSongs.current
      .filter((a) => !a.didFetch)
      .forEach((songObject) => {
        preloadSong(songObject);
      });

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

  async function loadSong() {
    const audioBuffer = await fetch(url)
      .then((res) => res.arrayBuffer())
      .then((ArrayBuffer) => audioContext.current.decodeAudioData(ArrayBuffer));

    return audioBuffer;
  }

  async function loadOrPlaySong(songName, shouldLoop) {
    const songObject = audioSongs.current.find((a) => a.name === songName);
    if (songObject.buffer) {
      playSong(songObject.buffer, shouldLoop);
      return;
    }

    const audioBuffer = await loadSong(songObject.url);
    audioSongs.current.map((a) => {
      if (a.name === songName) {
        return { ...a, didFetch: true, buffer: audioBuffer };
      }
    });

    playSong(audioBuffer, shouldLoop);
  }

  const childPlaySound = (url) => {
    loadSound(url, playSound);
  };

  const childPlaySong = (songName, shouldLoop = true) => {
    loadOrPlaySong(songName, shouldLoop);
  };

  const spawnPokemonSound = (pokemonId) => {
    let stringPokemonId = pokemonId.toString();
    Array.apply(null, Array(3 - stringPokemonId.length)).forEach((_i) => (stringPokemonId = "0" + stringPokemonId));
    childPlaySound(`/assets/cries/${stringPokemonId}.ogg`);
  };

  const allProps = { ...pageProps, childPlaySound, childPlaySong, spawnPokemonSound };

  return (
    <>
      <Component {...allProps} />
      <input defaultValue={getInitialVolume()} type="range" min="0" max="100" step="1" id="volume-slider" />
    </>
  );
}
