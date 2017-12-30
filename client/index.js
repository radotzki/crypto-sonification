const ws = new WebSocket('ws://0.0.0.0:8090');
import { initSound, playCelesta, playPlanet } from './sound';

main();

function main() {
    initSound();
    subscribeToMessages();
}

function subscribeToMessages() {
    ws.onmessage = event => {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.type === 'tx') {
            playTransaction(data);
        } else if (data.type === 'block') {
            playBlock(data);
        }
    };
}

function playTransaction(tx) {
    const max = 1;
    const minVolume = 0.3;
    const maxVolume = 0.7;
    let volume = tx.value / (max / (maxVolume - minVolume)) + minVolume;
    if (volume > maxVolume)
        volume = maxVolume;

    const maxPitch = 100.0;
    // We need to use a log that makes it so that maxBitcoins reaches the maximum pitch.
    // Well, the opposite of the maximum pitch. Anyway. So we solve:
    // maxPitch = log(maxBitcoins + logUsed) / log(logUsed)
    // For maxPitch = 100 (for 100%) and maxBitcoins = 1000, that gives us...
    const logUsed = 1.0715307808111486871978099;
    // So we find the smallest value between log(bitcoins + logUsed) / log(logUsed) and our max pitch...
    let pitch = Math.min(maxPitch, Math.log(tx.value + logUsed) / Math.log(logUsed));
    // ...we invert it so that a bigger transaction = a deeper noise...
    pitch = maxPitch - pitch;

    playCelesta(volume, pitch);
}

function playBlock(block) {
    const max = 20;
    const minVolume = 0.3;
    const maxVolume = 0.7;
    let volume = block.time / (max / (maxVolume - minVolume)) + minVolume;
    if (volume > maxVolume)
        volume = maxVolume;

    const maxPitch = 100.0;
    // We need to use a log that makes it so that maxBitcoins reaches the maximum pitch.
    // Well, the opposite of the maximum pitch. Anyway. So we solve:
    // maxPitch = log(maxBitcoins + logUsed) / log(logUsed)
    // For maxPitch = 100 (for 100%) and maxBitcoins = 1000, that gives us...
    const logUsed = 1.0715307808111486871978099;
    // So we find the smallest value between log(bitcoins + logUsed) / log(logUsed) and our max pitch...
    let pitch = Math.min(maxPitch, Math.log(block.time + logUsed) / Math.log(logUsed));
    // ...we invert it so that a bigger transaction = a deeper noise...
    pitch = maxPitch - pitch;

    const time = block.time * 1000;

    playPlanet(volume, pitch, time);
}
