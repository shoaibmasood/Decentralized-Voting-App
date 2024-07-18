"use client";
import Link from "next/link";
import { useAppContext } from "@/app/context/AppContext";
import { useVotingContract } from "@/app/hooks/useVotingContract";

export default function SideBar({ isSidebarOpen, toggleSidebar }) {
  const { address, notifySuccess, notifyError, setLoading, setEndTime } =
    useAppContext();

  const { votingContract } = useVotingContract();

  //Resetting Smart Contract
  const restContract = async () => {
    notifySuccess("kindly wait...");
    setLoading(true);

    try {
      const contract = await votingContract();
      const transaction = await contract.resetVotingContract();
      await transaction.wait();
      setLoading(false);
      notifySuccess("Successfully RESET ");
    } catch (error) {
      setLoading(false);
      notifySuccess("RESET failed, kindly connect to Admin Account");
      console.log(error);
    }
  };

  //StopVoting
  const stopVoting = async () => {
    try {
      const contract = await votingContract();
      const isVoting = await contract.isVotingStarted();
      if (isVoting == false) {
        return notifyError("Voting not Started Yet");
      }
      notifySuccess("kindly wait..");
      await contract.stopVoting();
      setEndTime(null);
      notifySuccess("Voting has been Successfully Stopped");
    } catch (error) {
      notifyError("Error: Voting not Stopped");
      console.log(error);
    }
  };

  console.log("sidebar", address);
  return (
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
          <h2 className="mt-4 text-md font-semibold">Welcom Back Admin</h2>
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
              href="/dashboard"
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
              <span className="ms-3">Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/candidatePage"
              className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-green-100"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">
                Candidate Registration
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/voterPage"
              className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-green-100 group"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">
                Voter Registration
              </span>
            </Link>
          </li>
          <li>
            <Link
              href=""
              className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-green-100  group"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    restContract();
                  }}
                >
                  Reset Contract
                </button>
              </span>
            </Link>
          </li>
          <li>
            <Link
              href=""
              className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-green-100  group"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">
                <button
                  onClick={() => {
                    stopVoting();
                  }}
                >
                  Stop Voting
                </button>
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
