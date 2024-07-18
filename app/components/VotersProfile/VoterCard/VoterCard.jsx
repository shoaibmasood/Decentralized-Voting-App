"use client";
import React from "react";
import Link from "next/link";
import { ADMIN_ADDRESS } from "@/app/constants/constants";
import { useAppContext } from "@/app/context/AppContext";

function VoterCard({
  name,
  age,
  address,
  hasVoted,
  registerId,
  votedFor,
  voterAllowed,
  ipfs,
}) {
  const { address: adminAddress } = useAppContext();
  return (
    <div className="p-2 shadow ">
      <div className="h-full flex items-center border-gray-200 p-4 rounded-lg">
        <img
          alt="team"
          className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
          src="https://dummyimage.com/80x80"
        />
        <div className="flex-grow">
          <h2 className="text-gray-900 title-font font-medium">{name}</h2>
          <p className="text-gray-500">
            Address:{address.slice(0, 6)}...
            {address.slice(address.length - 4)}
          </p>
          <p className="text-gray-500">
            Voter Allowed to Vote: {voterAllowed == 1 ? "Yes" : "No"}
          </p>
          <p className="text-gray-500">Registration ID: {registerId}</p>
          <p className="text-gray-500">
            Has Voted:{hasVoted == true ? "Yes" : "No"}
          </p>
          <p className="text-gray-500">Voted For Candidate ID: {votedFor}</p>
          <p className="text-gray-500">Age: {age}</p>
          {adminAddress?.toLowerCase() == ADMIN_ADDRESS.toLowerCase() ? (
            <p className="text-base leading-relaxed text-gray-500 ">
              Ipfs Url:{" "}
              <Link href={`https://${ipfs}`} target="_blank">
                IPFS URL
              </Link>
            </p>
          ) : null}
          <p className="text-gray-500">
            <strong>{hasVoted == true ? "Already voted" : "Not Votted"}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VoterCard;
