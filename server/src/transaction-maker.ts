import * as web3 from 'web3';
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const accounts = ["0x5dfe021f45f00ae83b0aa963be44a1310a782fcc", "0xfe2b768a23948eddd7d7caea55baa31e39045382", "0xa9a418da22532bd1189ff8be5cdaf3570bf9da43", "0x9f3a4bbed4660f2dccd6e980e2faa6d6214e5dc8", "0xc10261166b4699d3c1535aa30ac29446c755f065", "0xe480219e1904de4500cd8459c74d388457a3f3ec", "0xed7211f84b37b0f62d345462ffeb56b57b787539"];

export function makeTransactions() {
    sendTransaction();
    setTimeout(makeTransactions, randomTime());
}

function randomTime() {
    return Math.floor(Math.random() * 1000);
}

function randomValue() {
    return (Math.random() * 5).toFixed(3);
}

function randomAccountIdx() {
    return Math.floor(Math.random() * (accounts.length));
}

function sendTransaction() {
    const randomAccount = randomAccountIdx();
    const from = accounts[randomAccount];
    const to = accounts[(randomAccount + 1) % (accounts.length)];
    const value = web3.toWei(randomValue(), 'ether');
    web3.eth.sendTransaction({ from, to, value });
}
