import * as Howler from 'howler';

var globalVolume = 50;
var globalScalePitch;
var globalBank;
var globalShowDollar = false;

Howler.volume(globalVolume * 0.01);


export function Sound() {

}

var soundBank = [];
// the second number is the number of sound files available
soundBank[0] = ["celesta", 22];
soundBank[1] = ["planet", 33];
soundBank[2] = ["wikki", 13];

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

Sound.loadup = function () {
    var newSound;
    var istring;

    // sound0 = celesta
    sound0 = [];

    // sound1 = planet
    sound1 = [];

    // sound2 = celestaB
    sound2 = [];

    // String swells0, for blocks
    swells0 = [];

    // String swells1, for blocks
    swells1 = [];

    // String swells2, for blocks
    swells2 = [];

    // These variables are populated (and their sounds loaded) by the Sound.change function below.
};



Sound.init = function () {
    Sound.change(0);
};

Sound.change = function (instrument_number) {
    var musicianString = "Donate to instrument creator: ";
    var i;
    // INSTRUMENT 0
    // Load sound and swells if not already loaded
    if (sound0.length === 0) {
        for (i = 1; i <= 22; i++) {
            istring = zeroPad(i, 3);
            newSound = new Howl({
                urls: ["sounds/celesta/" + "celesta" + istring + ".ogg",
                "sounds/celesta/" + "celesta" + istring + ".mp3"],
                autoplay: false
            });
            sound0.push(newSound);
        }
    }
    if (swells0.length === 0) {
        for (i = 1; i <= 3; i++) {
            newSound = new Howl({
                urls: ["sounds/swells0/swell" + i + ".ogg",
                "sounds/swells0/swell" + i + ".mp3"],
                autoplay: false
            });
            swells0.push(newSound);
        }
    }
    currentSound = sound0;
    currentSwells = swells0;
};

var currentNotes = 0;
var noteTimeout = 500;

Sound.playRandomAtVolume = function (volume) {
    if (globalMute)
        return;

    var randomPitch = Math.floor(Math.random() * 100);
    Sound.playPitchAtVolume(volume, randomPitch);
};

Sound.playPitchAtVolume = function (volume, pitch) {
    if (globalMute)
        return;
    // Find the index corresponding to the requested pitch
    var index = Math.floor(pitch / 100.0 * currentSound.length);
    //console.log("Pitch: " + pitch);

    // Here we fuzz the index a bit to prevent the same sound
    // from being heard over and over again, which gets annoying
    var fuzz = Math.floor(Math.random() * 4) - 2;
    index += fuzz;
    index = Math.min(currentSound.length - 1, index);
    index = Math.max(0, index);

    //console.log("Fuzz: " + fuzz);
    //console.log("Index: " + index);


    //var readyState = currentSound[index].get("readyState");
    if (currentNotes < 5) {
        currentSound[index].volume(volume);
        currentSound[index].play();
        currentNotes++;
        setTimeout(function () {
            currentNotes--;
        }, noteTimeout);
    }
};

var lastBlockSound = -1;
Sound.playRandomSwell = function () {
    if (globalMute)
        return;

    var randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * currentSwells.length);
    } while (randomIndex == lastBlockSound);

    lastBlockSound = randomIndex;

    //var readyState = this.swells[randomIndex].get("readyState");
    //if (readyState >= 2)
    currentSwells[randomIndex].play();
};
