"use client";
import React, { useEffect, useState } from "react";
import CandidatesProfile from "../CandidatesProfile/CandidatesProfile";
import VotersProfile from "../VotersProfile/VotersProfile";
import WinnerModal from "../WinnerModal/WinnerModal";
import { Toaster } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";

import { useVotingContract } from "@/app/hooks/useVotingContract";
import { useAppContext } from "@/app/context/AppContext";
import { extractError } from "@/app/context/utils";
import RemainingTime from "../RemainingTime/RemainingTime";

function MainContent() {
  const { votingContract } = useVotingContract();

  const {
    notifySuccess,
    notifyError,
    loading,
    setLoading,
    totalCandidates,
    setTotalCandidates,
    totalVoters,
    setTotalVoters,
    votingDurationInMins,
    setVotingDurationInMins,
    endTime,
    setEndTime,
    isVotingStarted,
    setIsVotingStarted,
    toggleSidebar,
  } = useAppContext();

  //Get Total Nof of Candidates
  const getTotalCandidates = async () => {
    try {
      const contract = await votingContract();
      const candidatesLength = await contract.getCandidatesLength();
      setTotalCandidates(parseInt(candidatesLength));
    } catch (error) {
      console.log(error);
    }
  };
  //Get Total No of Voters
  const getTotalVoters = async () => {
    try {
      const contract = await votingContract();
      const votersLength = await contract.getVotersLength();
      setTotalVoters(parseInt(votersLength));
    } catch (error) {
      console.log(error);
    }
  };

  //Starting Voting
  const startVoting = async (votingDurationInMins) => {
    if (!votingDurationInMins)
      return notifyError("Please enter Voting duration In Minutes");
    try {
      setLoading(true);
      const contract = await votingContract();
      await contract.startVoting(votingDurationInMins);
      getVotingEndTime();
      notifySuccess(
        `Voting has been Started for ${votingDurationInMins} minutes`
      );
      setLoading(false);
      setVotingDurationInMins(null);
    } catch (error) {
      setLoading(false);
      notifyError(extractError(error?.data?.data?.message));
      setVotingDurationInMins(null);
      console.log("Start VOting Functions", error?.data?.data?.message);
    }
  };
  console.log("MainContent EndTIme", endTime);

  //Check If voting is Started or not
  const getVotingStarted = async () => {
    try {
      const contract = await votingContract();
      const isVoting = await contract.isVotingStarted();
      setIsVotingStarted(isVoting);
    } catch (error) {
      console.log("Error from getVotingStarted", error);
    }
  };

  //Get Voting EndTime
  const getVotingEndTime = async () => {
    try {
      const contract = await votingContract();
      const votingEndTime = await contract.votingEndTime();
      const isVoting = await contract.isVotingStarted();
      if (votingEndTime > 0 && isVoting) {
        setEndTime(votingEndTime);
      }
    } catch (error) {
      console.log("Error From GetVotingEndTime", error);
    }
  };

  useEffect(() => {
    getTotalCandidates();
    getTotalVoters();
    getVotingEndTime();
    getVotingStarted();
  }, []);

  console.log("MainContent isVoting", isVotingStarted);
  return (
    <div className="flex-1 p-4 lg:ml-30">
      <Toaster />
      <button onClick={toggleSidebar} className="lg:hidden p-2 mb-4">
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <h1 className="text-2xl font-semibold text-center">
        Decentralized Voting Web App
      </h1>
      <div className="bg-green-500 text-white p-4 flex justify-between items-center mt-4 rounded-lg">
        <div>Total Candidate: {totalCandidates}</div>
        {endTime && (
          <div>
            <RemainingTime votingEndTime={endTime} />
          </div>
        )}
        <div>Total Voter: {totalVoters}</div>
      </div>

      <div className="flex mt-4 justify-evenly items-baseline">
        <button
          onClick={() => {
            startVoting(votingDurationInMins);
          }}
          className="block text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Start Voting
        </button>
        <input
          type="text"
          id="voting-duration"
          // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-11 ps-10 pr-40 p-2.5 "
          placeholder="Voting Duration in Minutes..."
          required
          onChange={(e) => {
            setVotingDurationInMins(e.target.value);
          }}
        />
        <div>
          <WinnerModal isVotingStarted={isVotingStarted} />
        </div>
      </div>

      <h1 className="text-3xl font-semibold  text-center mt-4">
        Candidate Profiles
      </h1>
      <div className="flex mt-2">
        <CandidatesProfile />
      </div>
      <h1 className="text-3xl font-semibold  text-center">Voters Profiles</h1>
      <div className="flex mt-2">
        <VotersProfile />
      </div>
    </div>
  );
}

export default MainContent;
