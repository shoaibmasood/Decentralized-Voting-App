// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract Voting {
    // deployer of contract
    address public owner;

    uint256 public votingStartTime;
    uint256 public votingEndTime;

    bool public isVotingStarted;

    //Voter Registeration ID and Candidate Register ID
    uint256 private voterIdCounter;
    uint256 private candidateIdCounter;

    //Winner address
    address[] public winnerAddress;

    //List of addresses of all candidates
    address[] public candidateAddress;
    mapping(address => Candidate) candidates;
    //List of all addresses of all voters
    address[] public votersAddress;
    mapping(address => Voter) voters;

    //List of addresses of voters who have given votes
    address[] public votedVoters;

    struct Candidate {
        uint256 registerId;
        string name;
        uint256 age;
        address candidateAddress;
        uint256 voteCount;
        string ipfs;
    }

    struct Voter {
        uint256 registerId; //voterId
        string name;
        uint256 age;
        address voterAddress;
        bool hasVoted;
        string ipfs;
        uint256 votedFor; // track voter voted for which candidate ID
        uint256 voterAllowed; //initially set to 0
    }

    //Event for notifying Candidate has been added
    event candidateCreated(
        uint256 indexed registerId,
        string name,
        uint256 age,
        address candidateAddress,
        uint256 voteCount,
        string ipfs
    );

    //Event For notifying Voter has been added
    event voterCreated(
        uint256 indexed registerId,
        string name,
        uint256 age,
        address voterAddress,
        bool hasVoted,
        string ipfs
    );
    // For notifying Vote has casted
    event voteCasted(address indexed voterAddress, uint indexed candidateId);
    // For notifying Voting has been started
    event votingStarted(
        uint256 _votingStartTime,
        uint256 _votingEndTime,
        string message
    );

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
        isVotingStarted = false;

        console.log("The Contract is succesfully deployed");
    }

    //Check if the user i.e Candidate or Voter exists in the system
    function isUserexists(
        address _address,
        address[] memory usersArray
    ) internal pure returns (bool) {
        for (uint i = 0; i < usersArray.length; i++) {
            if (usersArray[i] == _address) {
                return true;
            }
        }
        return false;
    }

    //Add Single Candidate
    function addCandidate(
        address _candidateAddress,
        string memory _name,
        uint256 _age,
        string memory _ipfs
    ) public onlyOwner {
        require(
            !isUserexists(_candidateAddress, candidateAddress),
            "Candidate is Already Registered"
        );
        //increment the candidateIdCounter
        candidateIdCounter++;

        Candidate storage candidate = candidates[_candidateAddress];

        candidate.name = _name;
        candidate.age = _age;
        candidate.registerId = candidateIdCounter;
        candidate.voteCount = 0;
        candidate.candidateAddress = _candidateAddress;
        candidate.ipfs = _ipfs;

        //pushes the address of current/new candidate to address array
        candidateAddress.push(_candidateAddress);

        emit candidateCreated(
            candidate.registerId,
            _name,
            _age,
            _candidateAddress,
            candidate.voteCount,
            candidate.ipfs
        );
    }

    //Get All candidatedAddress
    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory candidateArray = new Candidate[](
            candidateAddress.length
        );
        for (uint256 i = 0; i < candidateAddress.length; i++) {
            candidateArray[i] = candidates[candidateAddress[i]];
        }
        return candidateArray;
    }

    //Get Total No of Candidates in System, like 2..
    function getCandidatesLength() public view returns (uint256) {
        return candidateAddress.length;
    }

    // Get Single Candidate Data
    function getSingleCandidateData(
        address _candidateAddress
    )
        public
        view
        returns (
            uint256,
            string memory,
            uint256,
            address,
            uint256,
            string memory
        )
    {
        return (
            candidates[_candidateAddress].registerId,
            candidates[_candidateAddress].name,
            candidates[_candidateAddress].age,
            candidates[_candidateAddress].candidateAddress,
            candidates[_candidateAddress].voteCount,
            candidates[_candidateAddress].ipfs
        );
    }

    // Register Single Voter
    function addVoter(
        address _voterAddress,
        string memory _name,
        uint256 _age,
        string memory _ipfs
    ) public onlyOwner {
        require(
            !isUserexists(_voterAddress, votersAddress),
            "Voter is Already Registered"
        );
        //increment the voterIdCounter
        voterIdCounter++;

        Voter storage voter = voters[_voterAddress];

        voter.voterAllowed = 1; //this property is to check if given voter is approved or registered or not in this voting
        voter.hasVoted = false;
        voter.name = _name;
        voter.age = _age;
        voter.voterAddress = _voterAddress;
        voter.registerId = voterIdCounter;
        voter.ipfs = _ipfs;

        //pushes the address of current/new voter to address array
        votersAddress.push(_voterAddress);

        emit voterCreated(
            voter.registerId,
            voter.name,
            voter.age,
            voter.voterAddress,
            voter.hasVoted,
            voter.ipfs
        );
    }

    //Cast Vote
    function castVote(
        address _candidateAddress,
        uint256 _candidateId
    ) external onlyDuringVotingPeriod {
        //check vote is given to registered Candidate Address
        require(
            isUserexists(_candidateAddress, candidateAddress),
            "selected Candidate is not Authoraized to Vote "
        );

        //Storing the referrence of Voter Struct in voter variable
        Voter storage voter = voters[msg.sender];

        //Check if the voter is already voted or not
        require(!voter.hasVoted, "You have already voted");
        // check if the voter is eligible to vote or not
        require(voter.voterAllowed != 0, "You have no right to vote");

        // recording voter's vote
        voter.hasVoted = true;
        voter.votedFor = _candidateId;

        votedVoters.push(msg.sender);

        // update the candidate Vote Count
        candidates[_candidateAddress].voteCount++;

        emit voteCasted(msg.sender, _candidateId);
    }

    //get All Voters
    function getAllVoters() public view returns (Voter[] memory) {
        Voter[] memory voterArray = new Voter[](votersAddress.length);
        for (uint256 i = 0; i < votersAddress.length; i++) {
            voterArray[i] = voters[votersAddress[i]];
        }
        return voterArray;
    }

    // Total No of Registered Voters in the system
    function getVotersLength() public view returns (uint256) {
        return votersAddress.length;
    }

    // Get Single Voter Data
    function getSingleVoter(
        address _voterAddress
    ) public view returns (Voter memory) {
        return voters[_voterAddress];
    }

    // Get List of Voted Voters Array
    function getListOfVotedVoters() public view returns (address[] memory) {
        return votedVoters;
    }

    // Start Voting
    function startVoting(uint256 votingDurationInMinutes) public onlyOwner {
        require(isVotingStarted == false, "Voting is already Started");
        require(
            candidateAddress.length >= 2,
            "Register Candidates Should be more than One"
        );
        require(votersAddress.length > 0, "There is no voter in the system");

        isVotingStarted = true;
        votingStartTime = block.timestamp;
        votingEndTime = block.timestamp + votingDurationInMinutes * 60; // converting into seconds

        emit votingStarted(
            votingStartTime,
            votingEndTime,
            "Voting has sucesfully started"
        );
    }

    //Stop voting
    function stopVoting() public onlyOwner {
        isVotingStarted = false;
        votingEndTime = 0;
    }

    //Get Winner
    function getWinner() public view returns (Candidate memory) {
        // require(votingEndTime > 0, "Voting not Started");
        require(
            block.timestamp > votingEndTime,
            "Voting is in progress, Please wait to be completed"
        );

        Candidate memory winningCandidate;
        uint256 maxVote = 0;
        for (uint256 i = 0; i < candidateAddress.length; i++) {
            Candidate memory candidate = candidates[candidateAddress[i]];
            if (candidate.voteCount > maxVote) {
                maxVote = candidate.voteCount;
                winningCandidate = candidate;
            }
        }
        return winningCandidate;
    }

    // Reset Contract Values and States
    function resetVotingContract() public onlyOwner {
        //Reset Candidate Mapping
        for (uint256 i = 0; i < candidateAddress.length; i++) {
            delete candidates[candidateAddress[i]];
        }

        //Reset Voter Mappings
        for (uint256 i = 0; i < votersAddress.length; i++) {
            delete voters[votersAddress[i]];
        }

        delete candidateAddress;
        delete votersAddress;
        delete votedVoters;

        voterIdCounter = 0;
        candidateIdCounter = 0;
        isVotingStarted = false;
        votingStartTime = 0;
        votingEndTime = 0;
    }

    // VotingRemaingTime
    function getRemainingVotingTime()
        public
        view
        onlyDuringVotingPeriod
        returns (uint256)
    {
        // returning Reaming Time in seconds
        return votingEndTime - block.timestamp;
    }
}
