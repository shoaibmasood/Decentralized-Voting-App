"use client";
import React, { useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { extractError } from "@/app/context/utils";
import { useVotingContract } from "@/app/hooks/useVotingContract";
import { ADMIN_ADDRESS } from "../../constants/constants";
import Link from "next/link";

function WinnerModal({ isVotingStarted }) {
  const [showModal, setShowModal] = useState(false);

  const { votingContract } = useVotingContract();
  const {
    address,
    winnerCandidate,
    setWinnerCandidate,
    notifyError,
    notifySuccess,
  } = useAppContext();

  //Get Winner
  const getWinner = async () => {
    if (!address) return notifyError("Please Connect wallet");
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    try {
      notifySuccess("Kindly wait..");
      const contract = await votingContract();
      const transaction = await contract.getWinner();
      // const {data: {}} =await axios.get(ipfs, {});
      if (transaction.candidateAddress.toLowerCase() == zeroAddress) return;
      const winnerData = {
        name: transaction.name,
        address: transaction.candidateAddress,
        registerId: transaction.registerId.toNumber(),
        voteCount: transaction.voteCount.toNumber(),
        age: transaction.age.toNumber(),
        ipfs: transaction.ipfs,
        // image: imgUrl
      };
      setWinnerCandidate(winnerData);
      console.log("winner", winnerData);
      setShowModal(true);
      notifySuccess("Sucessfully Announced Voting Result");
    } catch (error) {
      notifyError(extractError(error?.data?.data?.message));
      console.log("Winner Error", error);
    }
  };

  console.log("Winner State", winnerCandidate);
  return (
    <div>
      {/* <!-- Modal toggle --> */}
      <button
        onClick={() => {
          getWinner();
        }}
        className="block text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        type="button"
        disabled={isVotingStarted}
      >
        Voting Result
      </button>
      {showModal && (
        <div
          id="static-modal"
          aria-hidden="true"
          className=" overflow-y-auto  flex overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white rounded-lg shadow">
              {/* <!-- Modal header --> */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 className="text-xl  text-center font-semibold text-gray-900">
                  Winner Announcement
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
              <div className="p-4 md:p-5 space-y-4">
                <h4 className="text-xl  text-center font-semibold text-gray-900">
                  Candidate Details
                </h4>
                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                  <div className="flex-grow">
                    <p className="text-base leading-relaxed text-gray-500 ">
                      Name: {winnerCandidate?.name}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 ">
                      Address: {winnerCandidate?.address}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 ">
                      Registration ID: {winnerCandidate?.registerId}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 ">
                      Total Votes: {winnerCandidate?.voteCount}
                    </p>
                    {address?.toLowerCase() == ADMIN_ADDRESS.toLowerCase() ? (
                      <p className="text-base leading-relaxed text-gray-500 ">
                        Ipfs Url:{" "}
                        <Link
                          href={`https://${winnerCandidate?.ipfs}`}
                          target="_blank"
                        >
                          IPFS URL
                        </Link>
                      </p>
                    ) : null}
                  </div>

                  <img
                    alt="team"
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                    src="https://dummyimage.com/80x80"
                  />
                </div>
              </div>
              {/* <!-- Modal footer --> */}
              <div className=" items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
                <h5 className="text-xl  text-center font-semibold text-gray-900">
                  WINNER
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WinnerModal;
