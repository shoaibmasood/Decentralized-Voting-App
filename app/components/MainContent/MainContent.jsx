"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/app/constants/constants";

function MainContent() {
  const [totalCandidates, setTotalCandidates] = useState(null);
  const { isWeb3Enabled } = useMoralis();
  const {
    runContractFunction: getCandidatesLength,
    data,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: CONTRACT_ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "getCandidatesLength",
    params: {},
  });

  const {
    runContractFunction: startVoting,
    // data,
    // isLoading,
    // isFetching,
  } = useWeb3Contract({
    abi: CONTRACT_ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "startVoting",
    params: { votingDurationInMinutes: 1 },
  });

  const get_Candidates_Length = async () => {
    try {
      const response = await getCandidatesLength();

      console.log("response", parseInt(response));
      setTotalCandidates(parseInt(response));
    } catch (error) {
      console.log(error);
    }
  };

  const start_Voting = async () => {
    try {
      await startVoting();
    } catch (err) {
      console.log("Start VOting Functions", err.trasn);
    }
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      // get_Candidates_Length();
    }
  }, [isWeb3Enabled]);
  return (
    <div container flex>
      <SearchBar />
      <div className=" container flex justify-center ">
        <div>
          <button
            onClick={start_Voting}
            className="inline-flex text-white bg-green-500 border-0 py-2 px-12 focus:outline-none hover:bg-green-600 rounded text-lg"
          >
            Start Voting
          </button>
          <div>
            <input
              type="text"
              id="voting-duration"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 pr-40 p-2.5 "
              placeholder="Voting Duration in Minutes..."
              required
            />
          </div>
        </div>
        <div>
          <h2>Voting Time </h2>
        </div>
        Total No of Candidates : {totalCandidates}
      </div>
    </div>
  );
}

export default MainContent;
