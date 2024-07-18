"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

import WinnerModal from "../components/WinnerModal/WinnerModal";
import CandidatesProfile from "../components/CandidatesProfile/CandidatesProfile";
import RemainingTime from "../components/RemainingTime/RemainingTime";
import { useVotingContract } from "../hooks/useVotingContract";

function VoterView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    address,
    totalCandidates,
    setTotalCandidates,
    setTotalVoters,
    totalVoters,
    endTime,
    setEndTime,
    isVotingStarted,
  } = useAppContext();
  const { votingContract } = useVotingContract();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

  //Get Voting EndTime
  const getVotingEndTime = async () => {
    const contract = await votingContract();
    const votingEndTime = await contract.votingEndTime();
    if (votingEndTime > 0) {
      setEndTime(votingEndTime);
    }
  };

  //Redirect User if not Connected to Wallet
  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    getVotingEndTime();
    getTotalCandidates();
    getTotalVoters();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 lg:relative lg:inset-0 lg:w-64 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Sidebar</h2>
          <button onClick={toggleSidebar} className="lg:hidden p-2">
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="w-64 bg-gray-50 text-gray-900 h-30 p-4">
          <div className="flex flex-col items-center">
            <img
              className="w-96px h-96px rounded-full"
              src="https://via.placeholder.com/150"
              alt="Profile"
            />
            <h2 className="mt-4 text-md font-semibold">Voter Name</h2>
          </div>
          <div className="mt-2">
            <h3 className="text-md font-semibold text-center">
              {address ? (
                <div className="ml-auto py-2 px-4">
                  Connected to {address.slice(0, 6)}...
                  {address.slice(address.length - 4)}
                </div>
              ) : null}
            </h3>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2 font-medium container flex flex-col h-full content-between">
            <li>
              <Link
                href="/voterView"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-green-100"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">VoterView</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
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
        <p className="mt-4 text-gray-600 text-center">
          You are registerd in this Voting
        </p>
        <div className="bg-green-500 text-white p-4 flex justify-between items-center">
          <div>Total Candidate: {totalCandidates}</div>
          {endTime && (
            <div>
              <RemainingTime votingEndTime={endTime} />
            </div>
          )}
          <div>Total Voter: {totalVoters}</div>
        </div>
        <h1 className="text-3xl font-semibold  text-center">
          Candidate Profiles
        </h1>
        <div className="flex mt-2">
          <CandidatesProfile />
        </div>
        <div>
          <WinnerModal isVotingStarted={isVotingStarted} />
        </div>
      </div>
    </div>
  );
}

export default VoterView;
