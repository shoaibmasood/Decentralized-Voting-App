"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { InfinitySpin } from "react-loader-spinner";
// import Input from "../Input/Input";
import { useAppContext } from "@/app/context/AppContext";
import { useVotingContract } from "@/app/hooks/useVotingContract";

function CandidateRegistrationForm() {
  const [candidateName, setCandidateName] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [candidateAge, setCandidateAge] = useState(null);

  const { notifySuccess, notifyError, loading, setLoading } = useAppContext();

  console.log("form input", candidateAddress, candidateAge, candidateName);
  //Register Candidate
  const registerCandidate = async (
    candidateName,
    candidateAddress,
    candidateAge,
    imageUrl
  ) => {
    console.log(
      "inside register Candidate",
      candidateAddress,
      candidateName,
      candidateAge
    );
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
      // window.location.href = "/register-candidate";
    } catch (error) {
      setLoading(false);
      notifyError("Registration failed ");
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

  return (
    <div>
      <Toaster />
      <div>
        <h1>Register New Candidate</h1>
      </div>
      <div>
        <div>
          <div>
            <input
              name="name"
              type="text"
              placeholder="enter name"
              onChange={(e) => setCandidateName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              name="Address"
              type="text"
              placeholder="enter address"
              onChange={(e) => setCandidateAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              name="Age"
              type={Number}
              placeholder="enter age"
              onChange={(e) => setCandidateAge(e.target.value)}
            />
          </div>
        </div>
        <div>{/* //image upload component */}</div>
        <div>
          <button
            onClick={async () => {
              console.log("click");
              await registerCandidate(
                candidateName,
                candidateAddress,
                candidateAge
                // imageUrl
              );
            }}
          >
            Register Candidate
          </button>
        </div>
      </div>
      {loading && (
        <InfinitySpin
          visible={true}
          width="200"
          color="#4fa94d"
          ariaLabel="infinity-spin-loading"
        />
      )}
    </div>
  );
}

export default CandidateRegistrationForm;
