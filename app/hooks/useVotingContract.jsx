import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/app/constants/constants";

export const useVotingContract = () => {
  const fetchContract = (contractAddress, abi, signer) =>
    new ethers.Contract(contractAddress, abi, signer);

  const votingContract = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = fetchContract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      return contract;
    } catch (error) {
      console.log("Unable to Connect with SmartConract", error);
    }
  };
  return { votingContract };
};
