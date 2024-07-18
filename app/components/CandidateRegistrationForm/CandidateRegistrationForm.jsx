"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { InfinitySpin } from "react-loader-spinner";
import { useAppContext } from "@/app/context/AppContext";
import { useVotingContract } from "@/app/hooks/useVotingContract";
import { extractError } from "@/app/context/utils";

function CandidateRegistrationForm() {
  const [candidateName, setCandidateName] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [candidateAge, setCandidateAge] = useState(null);

  const { notifySuccess, notifyError, loading, setLoading, toggleSidebar } =
    useAppContext();

  //Register Candidate
  const registerCandidate = async (
    candidateName,
    candidateAddress,
    candidateAge,
    imageUrl
  ) => {
    if (!candidateName || !candidateAddress)
      return notifyError("Please fill required Fields");
    notifySuccess("Registering Candidate, Please Wait..");
    setLoading(true);

    const { votingContract } = useVotingContract();
    const contract = await votingContract();
    console.log("contract from candidate", contract);
    //stringigy data to upload it to ipfs
    const data = JSON.stringify({
      candidateName,
      candidateAddress,
      candidateAge,
      imageUrl,
    });
    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `a7c98f954e7430b8635e`,
          pinata_secret_api_key: `1e168700cf64758894d1fda4ca1a6e37be64cb26cff8bd49574a244d0dd88afb`,
          "Content-Type": "application/json",
        },
      });

      const url = `chocolate-wonderful-termite-990.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log("Register IPFS url", url);

      const transaction = await contract.addCandidate(
        candidateAddress,
        candidateName,
        candidateAge,
        url
      );

      await transaction.wait();
      console.log("transactionRecipt", await transaction.wait());
      notifySuccess("Successfully Registered Candidate");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notifyError("Candidate Registration failed ");
      notifyError(extractError(error?.data?.data?.message));

      console.log("Error from Register Candidate Function", error);
    }
  };

  const registerCandidateEvent = async () => {
    const { votingContract } = useVotingContract();
    const contract = await votingContract();
    contract.on("candidateCreated", (event) => {
      console.log("Candidate Created Event", event);
    });
  };
  useEffect(() => {
    registerCandidateEvent();
  }, []);

  //handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerCandidate(
      candidateName,
      candidateAddress,
      candidateAge
      // imageUrl
    );
  };
  return (
    <>
      {loading && (
        <InfinitySpin
          visible={true}
          width="200"
          color="#4fa94d"
          ariaLabel="infinity-spin-loading"
        />
      )}
      <div
        style={{ minWidth: "800px" }}
        className="min-h-screen bg-gray-100 flex items-center justify-center"
      >
        <Toaster />

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        >
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
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Candidate Registration Form
          </h2>
          <div className="flex flex-col items-center mb-4">
            <label
              className="block text-gray-700 mb-2 text-center"
              htmlFor="profileImage"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              // onChange={handleImageChange}
              className="hidden"
            />
            <div className="relative">
              <label htmlFor="profileImage" className="cursor-pointer">
                <img
                  src="https://via.placeholder.com/150"
                  // src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                />
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="fullname">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              // value={formData.firstName}
              // onChange={handleInputChange}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="enter full name"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              // value={formData.firstName}
              // onChange={handleInputChange}
              onChange={(e) => setCandidateAddress(e.target.value)}
              placeholder="enter address"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="age">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              min="0"
              // value={formData.firstName}
              // onChange={handleInputChange}
              onChange={(e) => setCandidateAge(e.target.value)}
              placeholder="enter age"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Register Candidate
          </button>
        </form>
      </div>
    </>
  );
}

export default CandidateRegistrationForm;
