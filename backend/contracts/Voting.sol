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

    //Event for notifying Candidate has been added
    event candidateCreated(
        uint256 indexed registerId,
        string name,
        uint256 age,
        address candidateAddress,
        // ApprovalStatus status,
        uint256 voteCount
    );

    //Event For notifying Voter has been added
    event voterCreated(
        uint256 indexed registerId,
        string name,
        uint256 age,
        address voterAddress,
        bool hasVoted
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
        uint256 _age
    )
        public
        // string memory _ipfs
        onlyOwner
    {
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
        // candidate.ipfs = _ipfs;
        // candidate.status

        //pushes the address of current/new candidate to address array
        candidateAddress.push(_candidateAddress);

        emit candidateCreated(
            candidate.registerId,
            _name,
            _age,
            _candidateAddress,
            candidate.voteCount
        );
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
        require(
            !isUserexists(_voterAddress, votersAddress),
            "Voter is Already Registered"
        );
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

        emit voterCreated(
            voter.registerId,
            voter.name,
            voter.age,
            voter.voterAddress,
            voter.hasVoted
        );
    }

    //Cast Vote
    function casteVote(
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
        require(voter.voterAllowed != 0, "You have no right to vote");

        // recording voter's vote
        voter.hasVoted = true;
        voter.votedFor = _candidateId;

        votedVoters.push(msg.sender);

        // update the candidate Vote Count
        candidates[_candidateAddress].voteCount++;

        // candidates[_candidateAddress].voteCount += voter.voterAllowed;

        emit voteCasted(msg.sender, _candidateId);
    }

    // Total No of Registered Voters in the system
    function getVotersLength() public view returns (uint256) {
        return votersAddress.length;
    }

    // Get Single Voter Data
    function getSingleVoterData(
        address _voterAddress
    )
        public
        view
        returns (
            uint256,
            string memory,
            uint256,
            address,
            bool,
            uint256,
            uint256
        )
    {
        return (
            voters[_voterAddress].registerId,
            voters[_voterAddress].name,
            voters[_voterAddress].age,
            voters[_voterAddress].voterAddress,
            voters[_voterAddress].hasVoted,
            voters[_voterAddress].voterAllowed,
            // voters[_voterAddress].status,
            // voters[_voterAddress].ipfs,
            voters[_voterAddress].votedFor // Candidate Id
        );
    }

    // Get List of Voted Voters Array
    function getListOfVotedVoters() public view returns (address[] memory) {
        return votedVoters;
    }

    // Get List of All Voters
    function getVotersList() public view returns (address[] memory) {
        return votersAddress;
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

    //For updating the voting status
    function updateVotingStatus() internal {
        if (isVotingStarted && block.timestamp > votingEndTime) {
            isVotingStarted = false;
        }
    }

    //Announce Winner
    function winner() public returns (uint256, Candidate memory) {
        //check if the election is finished then reset Votingstarted to false
        updateVotingStatus();
        require(votingEndTime > 0, "Voting not Started");
        require(
            isVotingStarted == false && block.timestamp > votingEndTime,
            "Voting is in progress, Please wait to be completed"
        );

        uint256 maxVote = 0;

        for (uint i = 0; i < candidateAddress.length; i++) {
            if (
                candidates[candidateAddress[i]].voteCount > 0 &&
                candidates[candidateAddress[i]].voteCount > maxVote
            ) {
                maxVote = candidates[candidateAddress[i]].voteCount;
                winnerAddress = [candidateAddress[i]];
            } else if (
                candidates[candidateAddress[i]].voteCount > 0 &&
                candidates[candidateAddress[i]].voteCount == maxVote
            ) {
                winnerAddress.push(candidateAddress[i]);
            }
        }
        // if WinnerAdress Array is empty no candidate  gets single vote, vote COunt is zero for all.
        if (winnerAddress.length == 0) {
            revert("No Candiddate get a Votes");
        }
        // else if (winnerAddress.length > 1) {
        //     for(uint i=0; i < winnerAddress.length; i++){
        //         return(maxVote, candidates[winnerAddress[i]]);
        //     }
        // }

        // if winnerAdress.lenght = 1  that is winner
        // if  winnerAdress.length >1 there is draw
        return (maxVote, candidates[winnerAddress[0]]);
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
