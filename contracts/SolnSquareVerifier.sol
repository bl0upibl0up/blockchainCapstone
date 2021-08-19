pragma solidity ^0.8.0;

import './ERC721Mintable.sol';

contract SolnSquareVerifier is ERC721Mintable{
    IVerifier private verifier;
    uint256 private index;
    struct Solution{
        uint256 solIndex;
        address solAddress;
    } 
    mapping(bytes32 => bool) solutions;

    event SolutionAdded(address caller, uint256 index, bytes32 hash);

    constructor(address verifierAddress, string memory name, string memory symbol) 
    ERC721Mintable(name, symbol) {
    verifier = IVerifier(verifierAddress);
    }

    function submitProof(uint[2] memory a_, uint[2][2] memory b_, uint[2] memory c_, uint[2] memory input_) internal {
        Solution memory solution = Solution({
            solIndex: index,
            solAddress: msg.sender
        });

        bytes32 hash = keccak256(abi.encode(solution));

        // Does the solution exist already?
        require(!solutions[hash], "Solution exists already");

        // Verify the proof
        require(verifier.verifyTx(a_, b_, c_, input_), "Solution not valid");

        // Proof is valid so add it to the array
        solutions[hash] = true;

        index++;

        emit SolutionAdded(msg.sender, index, hash);
    }

    function mintNft(uint[2] memory a_, uint[2][2] memory b_, uint[2] memory c_, uint[2] memory input_, uint256 tokenId) external{
        submitProof(a_, b_, c_, input_);
        super._mint(msg.sender, tokenId);
    }

}

interface IVerifier{
    function verifyTx(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) external returns (bool r);
}
  


























