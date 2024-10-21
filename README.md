# Decentralized Voting System Using Ethereum Blockchain

This repository contains the code and documentation for a decentralized voting system that leverages Ethereum blockchain technology to ensure voter anonymity, verifiability, and auditability, addressing issues such as voter fraud and lack of transparency.

## Abstract

The integration of blockchain technology with voting systems addresses key issues in traditional voting, such as voter fraud, ballot manipulation, and lack of trust. This project explores how blockchain’s immutability, decentralization, and transparency can provide a secure, tamper-proof voting system. Two research questions drive this investigation: ensuring anonymity, verifiability, and auditability, and exploring how smart contracts can establish transparent and tamper-resistant voting procedures.

The decentralized voting mechanism built on Ethereum smart contracts and IPFS focuses on privacy, transparency, and auditability. It includes a reset function to restart elections without contract redeployment. The system was rigorously tested for security and transparency, providing insights into future blockchain-based voting systems.

## Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/)
- **Smart Contracts**: [Solidity](https://soliditylang.org/)
- **Development Environment**: [Hardhat](https://hardhat.org/)
- **Blockchain Interaction**: [Ether.js](https://docs.ethers.io/)
- **Wallet**: [MetaMask](https://metamask.io/)
- **UI Design**: [Tailwind CSS](https://tailwindcss.com/)
- **Decentralized Storage**: [IPFS](https://ipfs.tech/)
- **Smart Contract IDE**: [Remix IDE](https://remix.ethereum.org/)

## Objective

The primary objective of this project is to develop a decentralized voting system with the following key features:
- **Secure Voting**: Smart contracts enforce secure voting, ensuring only eligible voters can participate.
- **Scalability and Privacy**: IPFS is integrated for private data storage, improving scalability and security.
- **Reset Mechanism**: A reset mechanism allows elections to be managed flexibly without redeploying the smart contract.
- **Auditability and Transparency**: Ensures data immutability while enabling audits of the voting process.

## Features

- **Voter Anonymity**: Voter privacy is protected throughout the voting process.
- **Verifiability**: Votes are verifiable, ensuring integrity.
- **Auditability**: The election process is fully auditable, allowing verification of results.
- **Reset Mechanism**: Administrators can reset the election without redeploying contracts.

## Installation

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
