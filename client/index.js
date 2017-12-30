const ws = new WebSocket('ws://0.0.0.0:8090');

ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log(data);
};

