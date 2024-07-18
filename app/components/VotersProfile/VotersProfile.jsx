"use client";
import React, { useEffect } from "react";
import VoterCard from "./VoterCard/VoterCard";
import { useVotingContract } from "@/app/hooks/useVotingContract";
import { useAppContext } from "@/app/context/AppContext";

function VotersProfile() {
  const { address, votersData, setVotersData } = useAppContext();
  const { votingContract } = useVotingContract();

  //Get ALl Registered Voters Data
  const getAllVoters = async () => {
    try {
      const contract = await votingContract();
      const votersArray = await contract.getAllVoters();
      console.log("VotersArray from Contract", votersArray);
      const votersData = await Promise.all(
        votersArray.map(
          async ({
            name,
            registerId,
            voterAddress,
            voterAllowed,
            hasVoted,
            votedFor,
            age,
            ipfs,
          }) => {
            // const {data: {}} =await axios.get(ipfs, {});
            return {
              name: name,
              voterAddress,
              registerId: registerId.toNumber(),
              voterAllowed: voterAllowed.toNumber(),
              age: age.toNumber(),
              hasVoted,
              votedFor: votedFor.toNumber(),
              ipfs,
              // imageUrl
            };
          }
        )
      );

      setVotersData(votersData);

      console.log("VotersArray from Contract", votersArray);
      console.log("Voters Data from State", votersData);
    } catch (error) {
      console.log("Error from Voters Profile", error);
    }
  };

  useEffect(() => {
    if (address) {
      getAllVoters();
    }
  }, []);

  return (
    <section className="text-gray-600">
      <div className="container px-5 py-10 mx-auto">
        <div className="flex   flex-wrap -m-2">
          {votersData?.map(
            (
              {
                name,
                age,
                voterAddress,
                hasVoted,
                registerId,
                votedFor,
                voterAllowed,
                ipfs,
              },
              indx
            ) => (
              <VoterCard
                key={indx}
                name={name}
                age={age}
                address={voterAddress}
                registerId={registerId}
                hasVoted={hasVoted}
                votedFor={votedFor}
                voterAllowed={voterAllowed}
                ipfs={ipfs}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default VotersProfile;
