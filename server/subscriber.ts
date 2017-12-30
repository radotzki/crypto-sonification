import * as web3 from 'web3';
import { Subject } from 'rxjs/Subject';
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

export const blocksSubject: Subject<Block> = new Subject();
export const transactionsSubject: Subject<Transaction> = new Subject();

export function startWatch() {
    watchBlocks();
    watchTransactions();
}

function watchBlocks() {
    let prevBlock;
    const blockFilter = web3.eth.filter('latest');
    blockFilter.watch(function (error, result) {
        if (error) {
            console.log(error);
            return;
        }

        const block = web3.eth.getBlock(result);

        if (prevBlock) {
            const time = block.timestamp - prevBlock;
            const size = block.size;
            const transactions = block.transactions.length;

            blocksSubject.next(new Block(time, size, transactions));
        }

        prevBlock = block.timestamp;
    });
}

function watchTransactions() {
    const txFilter = web3.eth.filter('pending');
    txFilter.watch(function (error, result) {
        if (error) {
            console.log(error);
            return;
        }

        const tx = web3.eth.getTransaction(result);
        const from = tx.from === null ? null : tx.from.toString();
        const to = tx.to === null ? null : tx.to.toString();
        const value = Number(web3.fromWei(tx.value.toString(), "ether"));

        transactionsSubject.next(new Transaction(from, to, value));
    });
}

export class Block {
    private type;

    constructor(public time: number, public size: number, public transactions: number) {
        this.type = 'block';
    }
}

export class Transaction {
    private type;

    constructor(public from: string, public to: string, public value: number) {
        this.type = 'tx';
    }
}
