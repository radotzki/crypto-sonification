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

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        try {
            client.send(JSON.stringify(data), function (err) {
                if (err) {
                    console.log(err.message);
                }
            });
        } catch (e) {
            console.log(e.message);
        }
    });
};