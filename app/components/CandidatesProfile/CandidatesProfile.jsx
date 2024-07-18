"use client";
import React, { useEffect } from "react";
import { useVotingContract } from "@/app/hooks/useVotingContract";
import { useAppContext } from "@/app/context/AppContext";
import CandidateCard from "./CandidateCard/CandidateCard";
import { extractError } from "@/app/context/utils";

function CandidatesProfile() {
  const {
    address,
    candidatesData,
    setCandidatesData,
    loading,
    setLoading,
    notifyError,
    notifySuccess,
  } = useAppContext();
  const { votingContract } = useVotingContract();
  // Get All Candidates
  const getAllCandidates = async () => {
    try {
      const contract = await votingContract();
      const candidatesArray = await contract.getAllCandidates();
      const candidatesData = await Promise.all(
        candidatesArray.map(
          async ({
            name,
            candidateAddress,
            registerId,
            voteCount,
            age,
            ipfs,
          }) => {
            // const {data: {}} =await axios.get(ipfs, {});
            return {
              name: name,
              candidateAddress,
              registerId: registerId.toNumber(),
              voteCount: voteCount.toNumber(),
              age: age.toNumber(),
              ipfs,
              // imageUrl
            };
          }
        )
      );

      setCandidatesData(candidatesData);

      console.log("CandidatesArray from Contract", candidatesArray);
      console.log("Canddiates Data from State", candidatesData);
    } catch (error) {
      console.log("error from Candidates Profiles", error);
    }
  };

  //Cast Vote
  const castVote = async (candidateAddress, registrationId) => {
    console.log("cast Vote", candidateAddress);
    if (!candidateAddress || !registrationId)
      return notifyError("Data Is Missing");

    try {
      notifySuccess("kindly wait...");
      setLoading(true);
      const contract = await votingContract();

      const transaction = await contract.castVote(
        candidateAddress,
        registrationId
      );
      transaction.wait();
      notifySuccess("Successfully voted ");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notifyError("vote failed,");
      notifyError(extractError(error?.data?.data?.message));
      console.log("CastVote ", error);
    }
  };
  useEffect(() => {
    if (address) {
      getAllCandidates();
    }
  }, []);

  return (
    <section className="text-gray-600">
      <div className="container px-5 py-10 mx-auto">
        <div className="flex  flex-wrap -m-2">
          {candidatesData?.map(
            (
              { name, age, candidateAddress, voteCount, registerId, ipfs },
              indx
            ) => (
              <CandidateCard
                key={indx}
                name={name}
                age={age}
                address={candidateAddress}
                voteCount={voteCount}
                registerId={registerId}
                handleCastVote={castVote}
                ipfs={ipfs}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default CandidatesProfile;
