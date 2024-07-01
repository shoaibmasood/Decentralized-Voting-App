"use client";
import React from "react";

import { useConnectBtn } from "@/app/hooks/useConnectBtn";

function ConnectButton() {
  //Custom Hook
  const { hasMetaMask, handleConnectWalletBtn } = useConnectBtn();

  return (
    <>
      <button
        onClick={handleConnectWalletBtn}
        className="inline-flex text-white bg-green-500 border-0 py-2 px-12 focus:outline-none hover:bg-green-600 rounded text-lg"
        // disabled={isWeb3EnableLoading}
        // disabled={hasMetaMask}
      >
        {hasMetaMask ? "Conntect Wallet" : "Please Install MetaMask"}
      </button>
    </>
  );
}

export default ConnectButton;
