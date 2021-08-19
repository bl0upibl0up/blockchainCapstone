const verifierContract = artifacts.require("Verifier");
const solnSquareContract = artifacts.require("SolnSquareVerifier");

const assert = require("assert");
const proof = require("../zokrates/code/square/proof.json");

contract('SolnSquareVerifier', accounts =>{
    const name = "ERC271Capstone";
    const symbol = "CAP";

    describe('test zokrates + ERC721 token', function(){
        beforeEach(async function () {
            let verifier = await verifierContract.new({from:accounts[0]});
            this.contract = await solnSquareContract.new(verifier.address, name, symbol, {from:accounts[0]});

            this.proof = {
                "proof": {
                  "a": [
                    "0x0669161841d36ab3c0bb9ced4a2b2818c48efb67b1080881f0fd25fa8fbdada8",
                    "0x17552ad47453b1df5e96856254c3cf2b00600333b86580b5625f572f97b74dcc"
                  ],
                  "b": [
                    [
                      "0x1bd9485202568ecc7b7c4cde34c1137bb8c393996c9da15cf043e23ea3566630",
                      "0x0b0f64198f2633ae912b998b217d2e228082af5b7d5b7cedbaec36a37bf30e60"
                    ],
                    [
                      "0x2f3a4cea6c2d6f47a1b542cc33429a928095176ddc282ed658758b7ea56d766f",
                      "0x0412a45047391f9ca57b0bdd919df2f244ca84cbf40ce524f0f433dbe5ae861a"
                    ]
                  ],
                  "c": [
                    "0x182af47162e0cb6baa0ae8067ee42a02d57d3dc9703b1b4f270d49ac5b18171b",
                    "0x02cdf772f538e8b26e876c9f2094dbc2029e9d26034611494e9a88f38a2b1085"
                  ]
                },
                "inputs": [
                  "0x0000000000000000000000000000000000000000000000000000000000000009",
                  "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
              }
        })

        it('should be able to mint a new token with valid solution', async function(){
            await this.contract.mintNft(this.proof['proof']['a'], 
                                        this.proof['proof']['b'], 
                                        this.proof['proof']['c'], 
                                        this.proof['inputs'], 0, {from: accounts[2]});

            let nbr_of_tokens = await this.contract.totalSupply();
            assert(nbr_of_tokens.toNumber() == 1, "There should be one token minted");

            let balance = await this.contract.balanceOf(accounts[2]);
            assert(balance, 1, "this account should have one token");
                
        })
        it('should not be able to mint a new token with an invalid solution', async function(){
            let fake_input = {
                "inputs": [
                    "0x0000000000000000000000000000000000000000000000000000000000000009",
                    "0x0000000000000000000000000000000000000000000000000000000000000002"
                ]
            }
            let reverted = false;
            try{
                await this.contract.mintNft(this.proof['proof']['a'],
                                            this.proof['proof']['b'],
                                            this.proof['proof']['c'],
                                            fake_input['inputs'], 0, {from: accounts[2]});
            }
            catch(e){
                reverted = true;
            }
            assert(reverted == true, "a token should not be minted with an invalid solution");
        })
        it('should not be able to mint the same token twice', async function(){
            await this.contract.mintNft(this.proof['proof']['a'],
                                        this.proof['proof']['b'],
                                        this.proof['proof']['c'], 
                                        this.proof['inputs'], 0, {from: accounts[2]});
            let reverted = false;
            try{
                await this.contract.mintNft(this.proof['proof']['a'],
                                            this.proof['proof']['b'],
                                            this.proof['proof']['c'], 
                                            this.proof['inputs'], 0, {from: accounts[2]});
            }
            catch(e){
                reverted = true;
            }
            assert(reverted == true, "you should not be able to mint the same token twice");
        })
    })
})