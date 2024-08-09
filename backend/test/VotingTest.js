const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { expect } = require("chai");

const { ethers } = require("hardhat");
describe("Voting", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployVotingFixture() {
    // Contracts are deployed using the first signer/account by default
    const [
      owner,
      otherAccount,
      candidate1Address,
      candidate2Address,
      voter1Address,
    ] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();

    return {
      voting,
      owner,
      otherAccount,
      candidate1Address,
      candidate2Address,
      voter1Address,
    };
  }

  async function voteCastTimeFixture() {
    const [owner, candidate1Address, candidate2Address, ...otherAccounts] =
      await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();

    // Generate 50 random addresses connected to the provider and funded
    const addresses = [];
    const provider = ethers.provider;

    for (let i = 0; i < 50; i++) {
      const wallet = ethers.Wallet.createRandom().connect(provider);
      addresses.push({
        wallet,
        name: `voter${i + 1}`,
        age: i + 1,
        ipfs: "ipfs",
      });

      // Fund the wallet
      await owner.sendTransaction({
        to: wallet.address,
        value: ethers.parseEther("1"),
      });
    }

    console.log(
      "Generated addresses:",
      addresses.map((a) => a.wallet.address)
    );

    await voting
      .connect(owner)
      .addCandidate(candidate1Address.address, "candidate1", 22, "ipfshash");
    await voting
      .connect(owner)
      .addCandidate(candidate2Address.address, "candidate2", 25, "ipfshash");

    // Adding 50 voters to the system
    for (let i = 0; i < addresses.length; i++) {
      await voting
        .connect(owner)
        .addVoter(
          addresses[i].wallet.address,
          addresses[i].name,
          addresses[i].age,
          "ipfs"
        );
    }

    await voting.connect(owner).startVoting(2);

    return {
      voting,
      owner,
      candidate1Address,
      candidate2Address,
      addresses,
    };
  }

  async function VoteCastFixture() {
    // Contracts are deployed using the first signer/account by default
    const [
      owner,
      otherAccount,
      candidate1Address,
      candidate2Address,
      voter1Address,
    ] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting
      .connect(owner)
      .addCandidate(candidate1Address, "candidate1", 22, "ipfshash");
    await voting
      .connect(owner)
      .addCandidate(candidate2Address, "candidate2", 25, "ipfshash");
    await voting
      .connect(owner)
      .addVoter(voter1Address, "voter1", 18, "ipfshash");
    await voting.connect(owner).startVoting(1);

    return {
      voting,
      owner,
      otherAccount,
      candidate1Address,
      candidate2Address,
      voter1Address,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { voting, owner } = await loadFixture(deployVotingFixture);

      expect(await voting.owner()).to.equal(owner.address);
    });
  });

  describe("Validations", function () {
    it("Should start voting with more than one candidate", async function () {
      const { voting, owner } = await loadFixture(deployVotingFixture);

      await expect(voting.connect(owner).startVoting(1)).to.be.revertedWith(
        "Register Candidates Should be more than One"
      );
    });

    it("Start Voting Should only be called by Owner ", async function () {
      const { voting, otherAccount } = await loadFixture(deployVotingFixture);

      await expect(
        voting.connect(otherAccount).startVoting(1)
      ).to.be.revertedWith("Only Owner/Admin can call this function");
    });

    it("Reset Voting Should only be called by Owner ", async function () {
      const { voting, otherAccount } = await loadFixture(deployVotingFixture);

      await expect(
        voting.connect(otherAccount).resetVotingContract()
      ).to.be.revertedWith("Only Owner/Admin can call this function");
    });

    it("add Candidate Should only be called by Owner ", async function () {
      const { voting, otherAccount, candidate1Address } = await loadFixture(
        deployVotingFixture
      );

      await expect(
        voting
          .connect(otherAccount)
          .addCandidate(candidate1Address, "candidate1", 22, "ipfshash")
      ).to.be.revertedWith("Only Owner/Admin can call this function");
    });

    it("add Voter Should only be called by Owner ", async function () {
      const { voting, otherAccount, voter1Address } = await loadFixture(
        deployVotingFixture
      );

      await expect(
        voting
          .connect(otherAccount)
          .addCandidate(voter1Address, "voter1", 22, "ipfshash")
      ).to.be.revertedWith("Only Owner/Admin can call this function");
    });

    it("getSingleVoter Should only be called by Owner ", async function () {
      const { voting, otherAccount, voter1Address } = await loadFixture(
        deployVotingFixture
      );

      await expect(
        voting.connect(otherAccount).getSingleVoter(voter1Address)
      ).to.be.revertedWith("Only Owner/Admin can call this function");
    });
  });

  describe("User Registrations", function () {
    it("Should Add Candidate", async function () {
      const { voting, owner, candidate1Address } = await loadFixture(
        deployVotingFixture
      );

      await expect(
        voting
          .connect(owner)
          .addCandidate(candidate1Address, "candidate1", 22, "ipfshash")
      ).to.emit(voting, "candidateCreated");
    });

    it("Should Add Voter", async function () {
      const { voting, owner, voter1Address } = await loadFixture(
        deployVotingFixture
      );

      await expect(
        voting.connect(owner).addVoter(voter1Address, "voter1", 18, "ipfshash")
      ).to.emit(voting, "voterCreated");
    });
  });

  describe("Cast Vote", function () {
    it("Should Cast Vote", async function () {
      const { voting, voter1Address, candidate1Address } = await loadFixture(
        VoteCastFixture
      );

      await expect(
        voting.connect(voter1Address).castVote(candidate1Address, 1)
      ).to.emit(voting, "voteCasted");
    });
  });

  describe("Cast Vote Time", function () {
    it("Should measure Average and single Vote Cast Time", async function () {
      const { voting, addresses, candidate1Address } = await loadFixture(
        voteCastTimeFixture
      );

      let totalTime = 0;

      for (let i = 0; i < addresses.length; i++) {
        const startTime = new Date().getTime();
        const tx = await voting
          .connect(addresses[i].wallet) // Connect the contract instance to the voter's wallet
          .castVote(candidate1Address.address, 1);
        await tx.wait();
        const endTime = new Date().getTime();

        const singleVoteTime = endTime - startTime;
        console.log("Single Vote cast time:", singleVoteTime);
        totalTime += singleVoteTime;
      }

      const averageTime = totalTime / addresses.length;

      console.log("Average vote cast time:", averageTime, "ms");
    });
  });
});
