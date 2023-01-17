import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

let isEventAdded = false;

export default function MusicPlayer({ Component, pageProps }) {
  const router = useRouter();
  const audioContext = useRef(createAudioContext());
  const gainNodeRef = useRef(null);
  const sourceRef = useRef(null);
  const musicSliderInput = getMusicRange();
  const soundSliderInput = getSoundRange();
  const audioSongs = useRef([
    { name: "victory", buffer: null, didFetch: false, url: "/assets/music/victory.mp3" },
    { name: "defeat", buffer: null, didFetch: false, url: "/assets/music/defeat.mp3" },
    { name: "tie", buffer: null, didFetch: false, url: "/assets/music/tie.mp3" },
    { name: "center", buffer: null, didFetch: false, url: "/assets/music/pokemon_center.mp3" },
    { name: "azalea", buffer: null, didFetch: false, url: "/assets/music/azalea_town.mp3" },
    { name: "gym_battle_1", buffer: null, didFetch: false, url: "/assets/music/gym_battle_1.mp3" },
    { name: "gym_battle_3", buffer: null, didFetch: false, url: "/assets/music/gym_battle_3.mp3" },
  ]);

  const audioSounds = useRef([
    { name: "Bug", buffer: null, url: "/assets/moves/pin_missle.mp3" },
    { name: "Dragon", buffer: null, url: "/assets/moves/dragon_breathe.mp3" },
    { name: "Electric", buffer: null, url: "/assets/moves/spark.mp3" },
    { name: "Fighting", buffer: null, url: "/assets/moves/karate_chop.mp3" },
    { name: "Fire", buffer: null, url: "/assets/moves/ember.mp3" },
    { name: "Flying", buffer: null, url: "/assets/moves/aeroblast.mp3" },
    { name: "Ghost", buffer: null, url: "/assets/moves/shadow_ball.mp3" },
    { name: "Grass", buffer: null, url: "/assets/moves/razor_leaf.mp3" },
    { name: "Ground", buffer: null, url: "/assets/moves/mud_shot.mp3" },
    { name: "Ice", buffer: null, url: "/assets/moves/aurora_beam.mp3" },
    { name: "Normal", buffer: null, url: "/assets/moves/swift.mp3" },
    { name: "Poison", buffer: null, url: "/assets/moves/sludge.mp3" },
    { name: "Psychic", buffer: null, url: "/assets/moves/psycho_boost.mp3" },
    { name: "Rock", buffer: null, url: "/assets/moves/ancient_power.mp3" },
    { name: "Steel", buffer: null, url: "/assets/moves/shadow_ball.mp3" },
    { name: "Water", buffer: null, url: "/assets/moves/bubble.mp3" },
  ]);

  function getMusicRange() {
    if (typeof window !== "undefined") {
      return document.getElementById("music-slider");
    }
  }

  function getSoundRange() {
    if (typeof window !== "undefined") {
      return document.getElementById("sound-slider");
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
    const { musicGain } = getOrCreateGain();
    musicGain.gain.setValueAtTime(newVolumne / 100, audioContext.current.currentTime);
    localStorage.setItem("volume", newVolumne);
  }

  function changeSoundVolume(event) {
    if (!audioContext.current) {
      return;
    }

    const newVolumne = parseInt(event.currentTarget.value);
    const { soundGain } = getOrCreateGain();
    soundGain.gain.setValueAtTime(newVolumne / 100, audioContext.current.currentTime);
    localStorage.setItem("sound", newVolumne);
  }

  async function loadSound(name, callback, url) {
    const nameSearch = (element) => element.name === name;
    const cacheAudioBuffer = audioSounds.current.find(nameSearch);
    if (!cacheAudioBuffer || cacheAudioBuffer.buffer === null) {
      const audioBuffer = await fetch(url)
        .then((res) => res.arrayBuffer())
        .then((ArrayBuffer) => audioContext.current.decodeAudioData(ArrayBuffer));

      const audioBufferObject = { name: name, buffer: audioBuffer, url: url };

      if (!cacheAudioBuffer) {
        audioSounds.current = [...audioSounds.current, audioBufferObject];
      } else {
        const audioBufferIndex = audioSounds.current.findIndex(nameSearch);
        audioSounds.current[audioBufferIndex] = audioBufferObject;
      }
      callback(audioBuffer);
    } else {
      callback(cacheAudioBuffer.buffer);
    }
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
    if (gainNodeRef.current === null) {
      gainNodeRef.current = {};
    }

    if (!gainNodeRef.current?.musicGain) {
      gainNodeRef.current.musicGain = audioContext.current.createGain();
      gainNodeRef.current.musicGain.connect(audioContext.current.destination);
    }

    if (!gainNodeRef.current?.soundGain) {
      gainNodeRef.current.soundGain = audioContext.current.createGain();
      gainNodeRef.current.soundGain.connect(audioContext.current.destination);
    }

    return gainNodeRef.current;
  }

  function playSong(buffer, shouldLoop = true) {
    let { musicGain } = getOrCreateGain();
    let source = createSource(musicGain);

    source.buffer = buffer;

    source.loop = shouldLoop;
    const currentVolume = parseInt(musicSliderInput.value);
    musicGain.gain.setValueAtTime(currentVolume / 100, audioContext.current.currentTime);
    source.start(0);
  }

  function playSound(buffer) {
    let { soundGain } = getOrCreateGain();
    let source = audioContext.current.createBufferSource();
    source.connect(soundGain);

    source.buffer = buffer;
    const currentVolume = parseInt(soundSliderInput.value);
    soundGain.gain.setValueAtTime(currentVolume / 100, audioContext.current.currentTime);
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
        const { musicGain } = getOrCreateGain();
        createSource(musicGain);
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

        musicSliderInput.addEventListener("change", changeVolume);
        soundSliderInput.addEventListener("change", changeSoundVolume);
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

  function getInitialSoundVolume() {
    if (typeof localStorage !== "undefined") {
      console.log(localStorage.getItem("sound"));
      return localStorage.getItem("sound") || "50";
    }

    return "50";
  }

  async function loadSong(url) {
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

  const childPlaySound = (name) => {
    const { url } = audioSounds.current.find((a) => a.name === name);
    loadSound(name, playSound, url);
  };

  const childPlaySong = (songName, shouldLoop = true) => {
    loadOrPlaySong(songName, shouldLoop);
  };

  const spawnPokemonSound = (pokemonId) => {
    let stringPokemonId = pokemonId.toString();
    Array.apply(null, Array(3 - stringPokemonId.length)).forEach((_i) => (stringPokemonId = "0" + stringPokemonId));
    loadSound(stringPokemonId, playSound, `/assets/cries/${stringPokemonId}.mp3`);
  };

  const musicSlider = (
    <input defaultValue={getInitialVolume()} type="range" min="0" max="100" step="1" id="music-slider" />
  );

  const soundSlider = (
    <input defaultValue={getInitialSoundVolume()} type="range" min="0" max="100" step="1" id="sound-slider" />
  );

  const allProps = { ...pageProps, childPlaySound, childPlaySong, spawnPokemonSound, musicSlider, soundSlider };

  return <Component {...allProps} />;
}
