const assert = require("assert");

var ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new("ERC721Cap", "CAP", {from: account_one});

            assert(await this.contract.mint(account_one, 0, {from: account_one}), 'could not mint first token');
            assert(await this.contract.mint(account_two, 1, {from: account_one}), 'could not mint second token');
            assert(await this.contract.mint(account_two, 2, {from: account_one}), 'could not mint third token');

            // TODO: mint multiple tokens
        })

        it('should return total supply', async function () { 
            let nbr_of_tokens = await this.contract.totalSupply();
            assert(nbr_of_tokens.toNumber(), 3, "There should be 3 token minted");
        })

        it('should get token balance', async function () { 
            let balanceAccountOne = await this.contract.balanceOf(account_one);
            let balanceAccountTwo = await this.contract.balanceOf(account_two);
            assert(balanceAccountOne, 1, "Account one should have 1 token");
            assert(balanceAccountTwo, 2, "Account two should have 2 tokens");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURI = await this.contract.tokenURI(1);
            assert(tokenURI == "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Token URI does not match");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.safeTransferFrom(account_two, account_one, 1, {from:account_two})
            let owner = await this.contract.ownerOf(1);
            assert(owner == account_one, "The token could not be transferred");
        })
        it('should fail to transfer a token not owned by the account', async function(){
            try{
                await this.contract.safeTransferFrom(account_two, account_one, 1, {from: account_two})
            }
            catch(e){
            }
            let owner = await this.contract.ownerOf(1);
            assert(owner != account_two, "the token should not belong to this account");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new("ERC721Cap", "CAP", {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let reverted = false;
            try{
                await this.contract.mint(account_one, 3, {from: account_two});
            }
            catch(e){
                reverted = true;
            }
            assert(reverted == true, 'you should not be able to mit from an account different from the contract owner');
            
        })

        it('should return contract owner', async function () { 

            let owner = await this.contract.getOwner();
            assert(owner == account_one, "the contract owner does not match");
            
        })

    });
})