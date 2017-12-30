import * as WebSocket from 'ws';
import { makeTransactions } from './transaction-maker';
import { startWatch, blocksSubject, transactionsSubject } from './subscriber';

const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8090 });
main();

function main() {
    startWatch();
    // makeTransactions();

    blocksSubject.subscribe(block => {
        console.log(block);
        wss.broadcast(block);
    });

    transactionsSubject.subscribe(tx => {
        console.log(tx);
        wss.broadcast(tx);
    });
}

wss.broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client !== wss && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};
