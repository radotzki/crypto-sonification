import * as web3 from 'web3';
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


var prev;
var blockFilter = web3.eth.filter('latest');
blockFilter.watch(function (error, result) {
    if (error) {
        console.log(error);
        return;
    }
    var block = web3.eth.getBlock(result);

    if (prev) {
        console.log('mining time ', block.timestamp - prev);
    }

    prev = block.timestamp;
    // wss.broadcast({
    //     subscription: 'blocks',
    //     data: {
    //         height: block.number,
    //         transactions_count: block.transactions.length,
    //         total_gas: block.gasUsed,
    //         size: block.size
    //     }
    // });

});

var txFilter = web3.eth.filter('pending');
txFilter.watch(function (error, result) {
    if (error) {
        console.log(error);
        return;
    }
    var tx = web3.eth.getTransaction(result);
    var isContract = tx.to !== null && web3.eth.getCode(tx.to.toString()) !== '0x' && tx.input !== null && tx.input !== '0x';

    console.log('tx from ', tx.from === null ? null : tx.from.toString());
    console.log('tx to ', tx.to === null ? null : tx.to.toString());
    console.log('tx value ', web3.fromWei(tx.value.toString(), "ether"));

    // wss.broadcast({
    //     subscription: 'transactions',
    //     data: {
    //         value: tx.value.toString(),
    //         to: tx.to === null ? null : tx.to.toString(),
    //         hash: tx.hash,
    //         isContract: isContract,
    //         gas: tx.gasUsed
    //     }
    // });
});


// eth.sendTransaction({from:eth.accounts[0], to:eth.accounts[1], value: web3.toWei(0.05, "ether")})