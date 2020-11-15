const Token = artifacts.require('Token.sol');
const HTLC = artifacts.require('HTLC.sol');

module.exports = async function (deployer, network, addresses) {
  const [bob, alice] = addresses;

  if (network === 'kovan') {
    //1. Bob deploys a the TKNA tone and will give 1 TKNA
    await deployer.deploy(Token, 'Token A', 'TKNA', { from: bob });
    const tokenA = await Token.deployed();

    //2.Bob Deploys the HTLC Contract and choose a secret for it(mySecret)
    await deployer.deploy(HTLC, 'mySecret', alice, tokenA.address, 1, { from: bob });
    const htlc = await HTLC.deployed();

    //3.Bob approve the HTLC contract to transfer from his address
    await tokenA.approve(htlc.address, 1, { from: bob });

    //4.Tokens will transfer from bob to the His HTLC contract
    await htlc.fund({ from: bob });
  }

  if (network === 'binanceTestnet') {
    //1. Alice deploys a the TKNB tone and will give 1 TKNB
    await deployer.deploy(Token, 'Token B', 'TKNB', { from: alice });
    const tokenB = await Token.deployed();
    //2. Alice will deploy her HTLC contract
    await deployer.deploy(HTLC, 'mySecret', bob, tokenB.address, 1, { from: alice });
    const htlc = await HTLC.deployed();
    //4.Bob approve the HTLC contract to transfer from his address
    await tokenB.approve(htlc.address, 1, { from: alice });
    //4.Tokens will transfer from alice to the Her HTLC contract
    await htlc.fund({ from: alice });
  }
};
