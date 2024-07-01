const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VotingModule", (m) => {
  const voting = m.contract("Voting");
  console.log("Contract Address", voting.address);
  return { voting };
});
