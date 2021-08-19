import SolnSquareVerifier from '../../build/contracts/SolnSquareVerifier.json';
import Verifier from '../../build/contracts/Verifier.json';
import Web3 from 'web3';

export default class Contract{
    constructor(callback){
        this.initialize(callback);
    }

    initialize(callback){
        this.web3 = new Web3(window.ethereum);
        //this.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/5f41b8eaaea34ad49df463cd5a98398f"));
        this.Verifier = new this.web3.eth.Contract(Verifier.abi, '0x6395CcB86f1E05fC294B9D01774b7EE775c18030');
        this.SolnSquareVerifier = new this.web3.eth.Contract(SolnSquareVerifier.abi, '0xE4288609Db6bF87E7E4f572CE247006f703CE9f0');
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
          };
        window.ethereum.request({method: 'eth_requestAccounts'});

        this.web3.eth.getAccounts((error, accs) =>{
            if(error){
                console.log('Failed to get accounts: ', error);
            }
            else{
                callback();
            }
        })
    }

    addEventsListener(callback){
        
        this.SolnSquareVerifier.events.allEvents(null, (error, result) => {
            this.handleSolnSquareVerifierEvent(result, callback);
        });
        this.Verifier.events.allEvents(null, (error, result) => {
            this.handleVerifierEvent(result, callback);
        });
    }

    handleSolnSquareVerifierEvent(result, callback){

        let text;
        switch(result.event){
            default:
                text = result.event;
                break;
        }
        console.log(result);
        callback(text + '. Tx Hash: ' + result.transactionHash);

    }
    
    handleVerifierEvent(result, callback){
        let text;
        switch(result.event){
            default:
                text = result.event;
                break;
        }
        console.log(result);
        callback(text + '. Tx Hash: ' + result.transactionHash);

    }

    mintToken(tokenId, callback){
        let self = this;
        this.web3.eth.getAccounts((error, accs) =>{
            if(error){
                console.error(error);
                callback(error, null);
            }
            else{
                console.log('hey');
                console.log(tokenId);
                self.SolnSquareVerifier.methods.mintNft(this.proof['proof']['a'], 
                this.proof['proof']['b'], 
                this.proof['proof']['c'], 
                this.proof['inputs'], tokenId).send({from: accs[0]});
            }
        })

    }
}
