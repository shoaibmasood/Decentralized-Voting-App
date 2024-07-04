"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Toaster } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";

import { useVotingContract } from "@/app/hooks/useVotingContract";
import { useAppContext } from "@/app/context/AppContext";

function MainContent() {
  const [totalCandidates, setTotalCandidates] = useState(null);
  const [totalVoters, setTotalVoters] = useState(null);
  const { votingContract } = useVotingContract();
  const {
    notifySuccess,
    notifyError,
    loading,
    setLoading,
    votingDurationInMins,
    setVotingDurationInMins,
  } = useAppContext();

  const getTotalCandidates = async () => {
    try {
      const contract = await votingContract();
      const candidatesLength = await contract.getCandidatesLength();
      setTotalCandidates(parseInt(candidatesLength));
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalVoters = async () => {
    try {
      const contract = await votingContract();
      const votersLength = await contract.getVotersLength();
      setTotalVoters(parseInt(votersLength));
    } catch (error) {
      console.log(error);
    }
  };

  const startVoting = async (votingDurationInMins) => {
    if (!votingDurationInMins)
      return notifyError("Please enter Voting duration In Minutes");
    try {
      setLoading(true);
      const contract = await votingContract();
      await contract.startVoting(votingDurationInMins);
      notifySuccess(
        `Voting has beend Started for ${votingDurationInMins} minutes`
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notifyError("Voting not started");
      console.log("Start VOting Functions", error);
    }
  };

  const startVotingEvent = async () => {
    const { votingContract } = useVotingContract();
    const contract = await votingContract();
    contract.on("votingStarted", (event) => {
      console.log("voting StartedEvent", parseInt(event));
    });
  };
  useEffect(() => {
    //startVoting
    // getListOfVotedVoters
    getTotalCandidates();
    getTotalVoters();
    startVotingEvent();
  }, []);

  return (
    <div>
      <Toaster />
      <div>
        <SearchBar />
      </div>
      <div className=" container flex justify-center ">
        <div>
          <button
            onClick={() => {
              startVoting(votingDurationInMins);
            }}
            className="inline-flex text-white bg-green-500 border-0 py-2 px-12 focus:outline-none hover:bg-green-600 rounded text-lg"
          >
            {loading ? (
              <ColorRing
                visible={true}
                height="30"
                width="30"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={["#e15b64"]}
              />
            ) : (
              "Start Voting"
            )}
          </button>
          <div>
            <input
              type="text"
              id="voting-duration"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 pr-40 p-2.5 "
              placeholder="Voting Duration in Minutes..."
              required
              onChange={(e) => {
                setVotingDurationInMins(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <h2>Voting Time </h2>
        </div>
      </div>
      <div>
        Total No of Candidates : {totalCandidates}
        <div>Total No of Voters: {totalVoters}</div>
      </div>
      <div>Candidate Profiles</div>
      <div>Voter Profiles</div>
    </div>
  );
}

export default MainContent;
