const ws = new WebSocket('ws://0.0.0.0:8090');
import { initSound, playCelesta, playPlanet } from './sound';

let svg;
let svg_background_color_online = '#0288D1',
    svg_background_color_offline = '#E91E63',
    svg_text_color = '#FFFFFF',
    newuser_box_color = 'rgb(41, 128, 185)',
    push_color = 'rgb(155, 89, 182)',
    issue_color = 'rgb(46, 204, 113)',
    pull_request_color = 'rgb(46, 204, 113)',
    comment_color = 'rgb(46, 204, 113)',
    edit_color = '#fff',
    total_sounds = 51;

var scale_factor = 6,
    note_overlap = 2,
    note_timeout = 300,
    current_notes = 0,
    max_life = 20000;

var width = window.innerWidth || element.clientWidth;
var height = window.innerHeight || element.clientHeight;

window.onload = main;

function main() {
    // Main drawing area
    svg = d3.select("#area").append("svg");
    svg.attr({ width, height });
    svg.style('background-color', svg_background_color_online);

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

        drawEvent(data, svg);
    };
}

function playTransaction(tx) {
    const max = 5;
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

function drawEvent(data, svg_area) {
    var starting_opacity = 1;
    var opacity = 1 / (100 / (data.value | data.transactions));
    if (opacity > 0.5) {
        opacity = 0.5;
    }
    var size = (data.value | data.transactions);
    var label_text;
    var ring_radius = 80;
    var ring_anim_duration = 3000;
    svg_text_color = '#FFFFFF';

    switch (data.type) {
        case "tx":
            label_text = `${data.value} ETH`;
            edit_color = '#B2DFDB';
            break;

        case "block":
            label_text = `${data.transactions} TXs, ${data.time} SEC`;
            edit_color = '#C6FF00';
            ring_anim_duration = 10000;
            ring_radius = 600;
            break;
    }

    var csize = size;
    var no_label = false;
    var type = data.type;

    var circle_id = 'd' + ((Math.random() * 100000) | 0);
    var abs_size = Math.abs(size);
    size = Math.max(Math.sqrt(abs_size) * scale_factor, 3);

    var x = Math.random() * (width - size) + size;
    var y = Math.random() * (height - size) + size;


    var circle_group = svg_area.append('g')
        .attr('transform', 'translate(' + x + ', ' + y + ')')
        .attr('fill', edit_color)
        .style('opacity', starting_opacity)


    var ring = circle_group.append('circle');
    ring.attr({ r: size, stroke: 'none' });
    ring.transition()
        .attr('r', size + ring_radius)
        .style('opacity', 0)
        .ease(Math.sqrt)
        .duration(ring_anim_duration)
        .remove();

    var circle_container = circle_group.append('a');
    circle_container.attr('fill', svg_text_color);

    var circle = circle_container.append('circle');
    circle.classed(type, true);
    circle.attr('r', size)
        .attr('fill', edit_color)
        .transition()
        .duration(max_life)
        .style('opacity', 0)
        .remove();


    circle_container.on('mouseover', function () {
        circle_container.append('text')
            .text(label_text)
            .classed('label', true)
            .attr('text-anchor', 'middle')
            .attr('font-size', '0.8em')
            .transition()
            .delay(1000)
            .style('opacity', 0)
            .duration(2000)
            .each(function () { no_label = true; })
            .remove();
    });

    var text = circle_container.append('text')
        .text(label_text)
        .classed('article-label', true)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.8em')
        .transition()
        .delay(2000)
        .style('opacity', 0)
        .duration(5000)
        .each(function () { no_label = true; })
        .remove();

    // Remove HTML of decayed events
    // Keep it less than 20
    const gs = document.querySelectorAll('#area svg g');
    if (gs.length > 20) {
        [...gs].slice(0, 10).forEach(g => g.remove());
    }
}