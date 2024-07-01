// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract VotingWithIPFS {
//     struct Voter {
//         bool registered;
//         string ipfsHash; // IPFS hash of the voter's data
//     }

//     struct Candidate {
//         string ipfsHash; // IPFS hash of the candidate's data
//         uint voteCount;
//     }

//     address public admin;
//     mapping(address => Voter) public voters;
//     mapping(address => Candidate) public candidates;

//     event VoterRegistered(address voter, string ipfsHash);
//     event CandidateRegistered(address candidate, string ipfsHash);
//     event VoteCast(address voter, address candidate, string voterIpfsHash, string candidateIpfsHash);

//     constructor() {
//         admin = msg.sender;
//     }

//     function registerVoter(address voter, string memory ipfsHash) public {
//         require(msg.sender == admin, "Only admin can register voters");
//         require(!voters[voter].registered, "Voter is already registered");

//         voters[voter] = Voter({
//             registered: true,
//             ipfsHash: ipfsHash
//         });

//         emit VoterRegistered(voter, ipfsHash);
//     }

//     function registerCandidate(address candidate, string memory ipfsHash) public {
//         require(msg.sender == admin, "Only admin can register candidates");

//         candidates[candidate] = Candidate({
//             ipfsHash: ipfsHash,
//             voteCount: 0
//         });

//         emit CandidateRegistered(candidate, ipfsHash);
//     }

//     function vote(address candidate, string memory updatedVoterIpfsHash, string memory updatedCandidateIpfsHash) public {
//         require(voters[msg.sender].registered, "You must be registered to vote");
//         require(bytes(candidates[candidate].ipfsHash).length != 0, "Candidate does not exist");
        
//         // Update voter data
//         voters[msg.sender].ipfsHash = updatedVoterIpfsHash;
        
//         // Update candidate data
//         candidates[candidate].ipfsHash = updatedCandidateIpfsHash;
//         candidates[candidate].voteCount += 1;

//         emit VoteCast(msg.sender, candidate, updatedVoterIpfsHash, updatedCandidateIpfsHash);
//     }

//     function getVoter(address voter) public view returns (string memory) {
//         require(voters[voter].registered, "Voter is not registered");
//         return voters[voter].ipfsHash;
//     }

//     function getCandidate(address candidate) public view returns (string memory, uint) {
//         require(bytes(candidates[candidate].ipfsHash).length != 0, "Candidate does not exist");
//         Candidate storage cand = candidates[candidate];
//         return (cand.ipfsHash, cand.voteCount);
//     }
// }