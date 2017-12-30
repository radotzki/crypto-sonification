const Howler = require('howler');

let sounds = [];
let swells = [];
let currentNotes = 0;
let noteTimeout = 500;

export function initSound() {
    for (let i = 1; i <= 22; i++) {
        let istring = zeroPad(i, 3);
        let newSound = new Howl({
            src: [
                "sounds/celesta/" + "celesta" + istring + ".ogg",
                "sounds/celesta/" + "celesta" + istring + ".mp3"
            ],
            autoplay: false
        });
        sounds.push(newSound);
    }

    for (let i = 1; i <= 3; i++) {
        let newSound = new Howl({
            src: [
                "sounds/swells/swell" + i + ".ogg",
                "sounds/swells/swell" + i + ".mp3"
            ],
            autoplay: false
        });
        swells.push(newSound);
    }
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

export function playRandomAtVolume(volume) {
    var randomPitch = Math.floor(Math.random() * 100);
    playPitchAtVolume(volume, randomPitch);
};

export function playPitchAtVolume(volume, pitch) {
    // Find the index corresponding to the requested pitch
    var index = Math.floor(pitch / 100.0 * sounds.length);
    //console.log("Pitch: " + pitch);

    // Here we fuzz the index a bit to prevent the same sound
    // from being heard over and over again, which gets annoying
    var fuzz = Math.floor(Math.random() * 4) - 2;
    index += fuzz;
    index = Math.min(sounds.length - 1, index);
    index = Math.max(0, index);

    //console.log("Fuzz: " + fuzz);
    //console.log("Index: " + index);


    //var readyState = sounds[index].get("readyState");
    if (currentNotes < 5) {
        sounds[index].volume(volume);
        sounds[index].play();
        currentNotes++;
        setTimeout(function () {
            currentNotes--;
        }, noteTimeout);
    }
};

var lastBlockSound = -1;
export function playRandomSwell() {
    var randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * swells.length);
    } while (randomIndex == lastBlockSound);

    lastBlockSound = randomIndex;

    //var readyState = this.swells[randomIndex].get("readyState");
    //if (readyState >= 2)
    swells[randomIndex].play();
};
