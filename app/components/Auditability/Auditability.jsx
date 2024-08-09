"use client";
import React, { useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { extractError } from "@/app/context/utils";
import { useVotingContract } from "@/app/hooks/useVotingContract";

function Auditability({ isVotingStarted }) {
  const [showModal, setShowModal] = useState(false);

  const { votingContract } = useVotingContract();
  const {
    address,

    notifyError,
    notifySuccess,
    totalCandidates,
    totalVoters,
    votedVotersList,
    setVotedVotersList,
    candidatesData,
    votersData,
  } = useAppContext();

  //Get Audit Details
  const getAuditDetails = async () => {
    try {
      notifySuccess("Kindly wait..");
      const contract = await votingContract();
      const votedVotersList = await contract.getListOfVotedVoters();
      setVotedVotersList(votedVotersList);
      const totalVotes = candidatesData.reduce((preVal, { voteCount }) => {
        return preVal + voteCount;
      }, 0);
      // const {data: {}} =await axios.get(ipfs, {});
      console.log("List of Voted Voters", votedVotersList);
      console.log("Candiates Data", candidatesData);
      console.log("voters data", votersData);
      setShowModal(true);
      notifySuccess("Auditability Details..");
    } catch (error) {
      notifyError(extractError(error?.data?.data?.message));
      console.log("Auditablity Error", error);
    }
  };

  return (
    <div>
      {/* <!-- Modal toggle --> */}
      <button
        onClick={() => {
          getAuditDetails();
        }}
        className="block text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        type="button"
        disabled={isVotingStarted}
      >
        Auditability Details
      </button>
      {showModal && (
        <div
          id="static-modal"
          className=" overflow-y-auto  flex overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white rounded-lg shadow">
              {/* <!-- Modal header --> */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 className="text-xl  text-center font-semibold text-gray-900">
                  Auditability Report
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <div className="p-4 md:p-5 space-y-4 border-b">
                <h4 className="text-xl  text-center font-semibold text-gray-900">
                  Auditability Details
                </h4>
                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                  <div className="flex-grow">
                    <p className="text-base leading-relaxed text-gray-500 ">
                      Total Number of Registered Candidates: {totalCandidates}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 ">
                      Total Number of Registered Voters: {totalVoters}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 ">
                      Total Number of Voters who has given votes:{" "}
                      {votedVotersList?.length}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 ">
                      Sum of All Candidate Votes:{" "}
                      {candidatesData.reduce((preVal, { voteCount }) => {
                        return preVal + voteCount;
                      }, 0)}
                    </p>
                  </div>

                  <div className="flex-grow">
                    <h5 className="text-xl   font-semibold border-b text-gray-900">
                      List of Candidates
                    </h5>
                    {candidatesData?.map(({ registerId, voteCount }, indx) => {
                      return (
                        <div key={indx} className="border-b">
                          <p className="text-base leading-relaxed text-gray-500 ">
                            Candidate Registration Id: {registerId}
                          </p>
                          <p className="text-base leading-relaxed text-gray-500 ">
                            Candidate VoteCount: {voteCount}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Auditability;
