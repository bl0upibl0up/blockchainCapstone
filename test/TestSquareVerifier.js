const assert = require("assert");

let Verifier = artifacts.require('Verifier');

contract('Verifier', accounts =>{
    describe('test zokrates verifier alone', function(){
        beforeEach(async function(){
            this.contract = await Verifier.new({from: accounts[0]});

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
        
        it('should correctly verify the transaction with zokrates', async function(){
            let success = await this.contract.verifyTx(this.proof['proof']['a'], 
                                                       this.proof['proof']['b'], 
                                                       this.proof['proof']['c'],
                                                       this.proof['inputs']);

            assert(success == true, 'tx not correctly verified with provided proof');
        })
    })
})