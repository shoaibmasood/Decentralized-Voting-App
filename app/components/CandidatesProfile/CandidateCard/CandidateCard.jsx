"use client";
import React from "react";
import { ADMIN_ADDRESS } from "@/app/constants/constants";
import { useAppContext } from "@/app/context/AppContext";
import Link from "next/link";

function CandidateCard({
  name,
  registerId,
  age,
  address,
  image,
  voteCount,
  handleCastVote,
  ipfs,
}) {
  const { address: adminAddress } = useAppContext();

  return (
    <div className="p-2 mr-2 shadow ">
      <div className="h-full flex items-center  border-gray-200  p-4 rounded-lg">
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
          <p className="text-gray-500">RegistrationID: {registerId}</p>
          <p className="text-gray-500">VoteCount:{voteCount}</p>
          {adminAddress?.toLowerCase() == ADMIN_ADDRESS.toLowerCase() ? (
            <p className="text-base leading-relaxed text-gray-500 ">
              Ipfs Url:{" "}
              <Link href={`https://${ipfs}`} target="_blank">
                IPFS URL
              </Link>
            </p>
          ) : null}
          <button
            onClick={() => {
              handleCastVote(address, registerId);
            }}
            className="inline-flex text-white bg-green-500 border-0 py-2 px-12 focus:outline-none hover:bg-green-600 rounded-lg text-md"
          >
            Cast Vote
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateCard;
