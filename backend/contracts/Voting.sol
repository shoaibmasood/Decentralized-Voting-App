// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Voting {
    // deployer of contract
    address public owner;

    uint256 public votingStartTime;
    uint256 public votingEndTime;

    uint256 private voterIdCounter;
    uint256 private candidateIdCounter;

    enum ApprovalStatus {
        Pending,
        Approved,
        Rejected
    }

    struct Candidate {
        uint256 registerId;
        string name;
        uint256 age;
        address candidateAddress;
        ApprovalStatus status;
        uint256 voteCount;
        // string ipfs;
    }

    event candidateCreated(
        uint256 indexed registerId,
        string name,
        uint256 age,
        address candidateAddress,
        ApprovalStatus status,
        uint256 voteCount
    );

    //List of addresses of all candidates
    address[] public candidateAddress;
    mapping(address => Candidate) candidates;

    struct Voter {
        uint256 registerId; //voterId
        string name;
        uint256 age;
        address voterAddress;
        ApprovalStatus status;
        bool hasVoted;
        string ipfs;
        uint256 votedFor; // track voter voted for which candidate ID
        uint256 voterAllowed; //initially set to 0
    }

    event voterCreated(
        uint256 indexed registerId,
        string name,
        uint256 age,
        address voterAddress,
        //  ApprovalStatus status,
        bool hasVoted
    );

    // For notifying Vote has casted
    event voteCased(address indexed voter, uint indexed candidateId);

    //List of all addresses of all voters
    address[] public votersAddress;
    mapping(address => Voter) voters;

    //List of addresses of voters who have given votes
    address[] public votedVoters;

    //Modifiers
    // These modifer will run before the fucntion execution
    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner/Admin can call this function");
        _;
    }
    modifier onlyDuringVotingPeriod() {
        require(
            block.timestamp >= votingStartTime &&
                block.timestamp <= votingEndTime,
            "voting is not active"
        );
        _;
    }

    constructor() {
        //setting the deployer of contract  to its owner
        owner = msg.sender;
    }

    //Add Single Candidate
    function addCandidate(
        address _candidateAddress,
        string memory _name,
        uint256 _age,
        string memory _ipfs
    ) public onlyOwner {
        //increment the candidateIdCounter
        candidateIdCounter++;

        Candidate storage candidate = candidates[_candidateAddress];

        candidate.name = _name;
        candidate.age = _age;
        candidate.registerId = candidateIdCounter;
        candidate.voteCount = 0;
        candidate.candidateAddress = _candidateAddress;
        // candidate.ipfs = _ipfs;
        // candidate.status

        //pushes the address of current/new candidate to address array
        candidateAddress.push(_candidateAddress);

        // emit candidateCreated(
        //     registerId, _name, _age, _candidateAddress, status, candidate.voteCount
        // );
    }

    //Get All candidatedAddress
    function getALLCandidate() public view returns (address[] memory) {
        return candidateAddress;
    }

    //Get Total No of Candidates in System, like 2..
    function getCandidatesLength() public view returns (uint256) {
        return candidateAddress.length;
    }

    // Get Single Candidate Data
    function getSingleCandidateData(
        address _candidateAddress
    ) public view returns (uint256, string memory, uint256, address, uint256) {
        return (
            candidates[_candidateAddress].registerId,
            candidates[_candidateAddress].name,
            candidates[_candidateAddress].age,
            candidates[_candidateAddress].candidateAddress,
            candidates[_candidateAddress].voteCount
            // candidates[_candidateAddress].ipfs,
        );
    }

    // Register Single Voter
    function addVoter(
        address _voterAddress,
        string memory _name,
        uint256 _age,
        string memory _ipfs
    ) public onlyOwner {
        //increment the voterIdCounter
        voterIdCounter++;

        Voter storage voter = voters[_voterAddress];

        // is this condition needed here? c
        // require(voter.hasVoted == false, "Voter has already voted");

        voter.voterAllowed = 1; //this property is to check if given voter is approved or registered or not in this voting
        voter.hasVoted = false;
        voter.name = _name;
        voter.age = _age;
        voter.voterAddress = _voterAddress;
        voter.registerId = voterIdCounter;
        voter.ipfs = _ipfs;

        //pushes the address of current/new voter to address array
        votersAddress.push(_voterAddress);

        // emit voterCreated(
        //     voter.registerId,
        //     voter.name,
        //     voter.age,
        //     voter.voterAddress,
        //     voter.hasVoted
        // );
    }

    //Cast Vote
    function casteVote(
        address _candidateAddress,
        uint256 _candidateId
    ) external onlyDuringVotingPeriod {
        //Storing the referrence of Voter Struct in voter variable
        Voter storage voter = voters[msg.sender];

        //Check if the voter is already voted or not
        require(!voter.hasVoted, "You have already voted");
        require(voter.voterAllowed != 0, "You have no right to vote");

        // recording voter's vote
        voter.hasVoted = true;
        voter.votedFor = _candidateId;

        votedVoters.push(msg.sender);

        // update the candidate Vote Count
        candidates[_candidateAddress].voteCount++;
    
        // candidates[_candidateAddress].voteCount += voter.voterAllowed;

        emit voteCased(msg.sender, _candidateId);
    }
}
