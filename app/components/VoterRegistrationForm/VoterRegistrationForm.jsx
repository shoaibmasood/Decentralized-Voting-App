"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { InfinitySpin } from "react-loader-spinner";
import { useAppContext } from "@/app/context/AppContext";
import { useVotingContract } from "@/app/hooks/useVotingContract";

function VoterRegistrationForm() {
  const [voterName, setVoterName] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [voterAge, setVoterAge] = useState(null);

  const { notifySuccess, notifyError, loading, setLoading } = useAppContext();

  console.log("form voter input", voterAddress, voterAge, voterName);
  //Register Candidate
  const registerVoter = async (voterName, voterAddress, voterAge, imageUrl) => {
    console.log("inside register Voter", voterAddress, voterName, voterAge);
    if (!voterName || !voterAddress)
      return notifyError("Please fill required Fields");
    notifySuccess("Registering Voter, Please Wait..");
    setLoading(true);

    const { votingContract } = useVotingContract();
    const contract = await votingContract();
    console.log("contract from Voter", contract);
    //stringigy data to upload it to ipfs
    const data = JSON.stringify({
      voterName,
      voterAddress,
      voterAge,
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
      console.log("Register Voter IPFS url", url);

      const transaction = await contract.addVoter(
        voterAddress,
        voterName,
        voterAge,
        url
      );

      await transaction.wait();
      console.log("transactionRecipt", await transaction.wait());
      notifySuccess("Successfully Registered Voter");
      setLoading(false);
      // window.location.href = "/register-candidate";
    } catch (error) {
      setLoading(false);
      notifyError("Registration failed ");
      console.log("Error from Register Voter Function", error);
    }
  };

  const registerVoterEvent = async () => {
    const { votingContract } = useVotingContract();
    const contract = await votingContract();
    contract.on("voterCreated", (event) => {
      // console.log("voterCreated Created Event", event.evet[0].log);
    });
  };
  useEffect(() => {
    registerVoterEvent();
  }, []);

  return (
    <div>
      <Toaster />
      <div>
        <h1>Register New Voter</h1>
      </div>
      <div>
        <div>
          <div>
            <input
              name="name"
              type="text"
              placeholder="enter name"
              onChange={(e) => setVoterName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              name="Address"
              type="text"
              placeholder="enter address"
              onChange={(e) => setVoterAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              name="Age"
              type={Number}
              placeholder="enter age"
              onChange={(e) => setVoterAge(e.target.value)}
            />
          </div>
        </div>
        <div>{/* //image upload component */}</div>
        <div>
          <button
            onClick={async () => {
              await registerVoter(
                voterName,
                voterAddress,
                voterAge
                // imageUrl
              );
            }}
          >
            Register Voter
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

export default VoterRegistrationForm;
