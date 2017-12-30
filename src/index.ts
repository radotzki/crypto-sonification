import { makeTransactions } from './transaction-maker';
import { startWatch, blocksSubject, transactionsSubject } from './subscriber';

main();

function main() {
    startWatch();
    makeTransactions();

    blocksSubject.subscribe(block => {
        console.log(block);
    });

    transactionsSubject.subscribe(tx => {
        console.log(tx);
    });
}