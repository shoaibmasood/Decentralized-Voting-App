import { ethers } from "ethers";
import Web3Modal from "web3modal";

export const isWalletConnected = async () => {
  if (!window.ethereum) return console.log("Please install MetaMask ");
};
