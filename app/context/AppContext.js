"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_ADDRESS } from "../constants/constants";
import toast from "react-hot-toast";
import { useVotingContract } from "../hooks/useVotingContract";

const AppContext = createContext(undefined);

//Get Connected account to wallet
export const checkIfWalletIsConnected = async () => {
  const account = await window.ethereum.request({ method: "eth_accounts" });

  if (account.length) {
    return account[0];
  } else {
    console.log("Please Install MetaMask & Connect, Reload");
  }
};

const notifySuccess = (msg) => toast.success(msg, { duration: 3000 });
const notifyError = (msg) => toast.error(msg, { duration: 3000 });

export function AppContextWrapper({ children }) {
  const [address, setAddress] = useState(null);
  //Loading State
  const [loading, setLoading] = useState(false);
  //Voting Duration
  const [votingDurationInMins, setVotingDurationInMins] = useState(null);
  //set Date
  const [startingDate, setStartingDate] = useState(Date.now());
  //Candidates Data
  const [candidatesData, setCandidatesData] = useState(null);
  //Voters Data
  const [votersData, setVotersData] = useState(null);
  //WinnerCandidate Data
  const [winnerCandidate, setWinnerCandidate] = useState(null);
  // Total No of Candidates
  const [totalCandidates, setTotalCandidates] = useState(null);
  //Total No of Voters
  const [totalVoters, setTotalVoters] = useState(null);
  // TImer
  const [endTime, setEndTime] = useState(null);
  //Flag for Voting Started
  const [isVotingStarted, setIsVotingStarted] = useState(null);
  //SideBar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //Voted Voters List
  const [votedVotersList, setVotedVotersList] = useState([]);

  const router = useRouter();

  //custom hook for connecting with SmartContract
  const { votingContract } = useVotingContract();

  const handleOnAccountChanged = (newAccount) => {
    console.log(`Account changed to ${newAccount[0]}`);
    if (newAccount.length == 0) {
      console.log("Wallet is Disconnected");
      setAddress(null);
      window.localStorage.removeItem("connected");
      router.push("/");
    } else {
      console.log("New Acount Changed to", newAccount[0]);
      window, localStorage.setItem("connected", newAccount[0]);
      setAddress(newAccount[0]);
    }
  };

  //Toogle Side Bar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  console.log("address", address);

  // check if user has  switched  accounts
  useEffect(() => {
    window.ethereum?.on("accountsChanged", handleOnAccountChanged);

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener(
          "accountsChanged",
          handleOnAccountChanged
        );
      }
    };
  }, []);

  useEffect(() => {
    if (address == ADMIN_ADDRESS.toLowerCase() && address) {
      router.push("/dashboard");
    } else if (address) {
      router.push("/voterView");
    }
  }, [address]);

  //
  return (
    <AppContext.Provider
      value={{
        address,
        setAddress,
        checkIfWalletIsConnected,
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
        startingDate,
        setStartingDate,
        candidatesData,
        setCandidatesData,
        votersData,
        setVotersData,
        winnerCandidate,
        setWinnerCandidate,
        endTime,
        setEndTime,
        isVotingStarted,
        setIsVotingStarted,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        votedVotersList,
        setVotedVotersList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;

export const useAppContext = () => useContext(AppContext);
