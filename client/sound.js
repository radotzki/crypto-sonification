const Howler = require('howler');

let celesta = [];
let planet = [];

export function initSound() {
    for (let i = 1; i <= 22; i++) {
        let istring = zeroPad(i, 3);

        celesta.push(new Howl({
            src: [
                "sounds/celesta/" + "celesta" + istring + ".ogg",
                "sounds/celesta/" + "celesta" + istring + ".mp3"
            ],
            autoplay: false
        }));

        planet.push(new Howl({
            src: [
                "sounds/planet/" + "planet" + istring + ".ogg",
                "sounds/planet/" + "planet" + istring + ".mp3"
            ],
            autoplay: false
        }));
    }
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

export function playCelesta(volume, pitch) {
    const idx = calcIdx(pitch, celesta);
    celesta[idx].volume(volume);
    celesta[idx].play();
}

export function playPlanet(volume, pitch, time) {
    const idx = calcIdx(pitch, planet);
    console.log('volume, pitch, time, idx', volume, pitch, time, idx);
    planet[idx].volume(volume);
    planet[idx].fade(1, 0, time);
    planet[idx].play();
}

function calcIdx(pitch, sounds) {
    // Find the index corresponding to the requested pitch
    let index = Math.floor(pitch / 100.0 * sounds.length);

    // Here we fuzz the index a bit to prevent the same sound
    // from being heard over and over again, which gets annoying
    const fuzz = Math.floor(Math.random() * 4) - 2;
    index += fuzz;
    index = Math.min(sounds.length - 1, index);
    index = Math.max(0, index);

    return index;
}
