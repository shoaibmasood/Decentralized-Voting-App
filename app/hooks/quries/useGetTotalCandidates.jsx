"use client";
import { useState } from "react";
import { useVotingContract } from "../useVotingContract";

export const useGetTotalCandidates = async () => {
  const [totalCandidates, setTotalCandidates] = useState(null);
  const { votingContract } = useVotingContract();

  try {
    const contract = await votingContract();
    console.log("useVotingContract", contract);
    const candidatesLength = await contract.getCandidatesLength();

    console.log("response", parseInt(candidatesLength));
    setTotalCandidates(parseInt(candidatesLength));
  } catch (error) {
    console.log(error);
  }

  return { totalCandidates, setTotalCandidates, error };
};
