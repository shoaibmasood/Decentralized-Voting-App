"use client";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export const useConnectBtn = () => {
  const [hasMetaMask, setHasMetaMask] = useState(true);
  const { enableWeb3, isWeb3Enabled } = useMoralis();

  useEffect(() => {
    //checking if metamask is installed  or not
    if (
      typeof window.ethereum == "undefined" &&
      typeof window.ethereum?.isMetaMask == "undefined"
    ) {
      setHasMetaMask(false);
    }
  }, []);

  //check if the user already login or not
  useEffect(() => {
    if (
      !isWeb3Enabled &&
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  const handleConnectBtn = async () => {
    const ret = await enableWeb3();
    if (typeof ret !== "undefined") {
      // depends on what button they picked
      if (typeof window !== "undefined") {
        window.localStorage.setItem("connected", "injected");
      }
    }
  };

  return { hasMetaMask, handleConnectBtn };
};
