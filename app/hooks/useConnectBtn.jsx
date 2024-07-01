"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

export const useConnectBtn = () => {
  const [hasMetaMask, setHasMetaMask] = useState(true);
  const { setAddress } = useAppContext();

  //checking if metamask is installed  or not
  useEffect(() => {
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
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      setAddress(window.localStorage.getItem("connected"));
    }
  }, []);

  const handleConnectWalletBtn = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("handle accounts hook", accounts);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("connected", accounts[0]);
      }
      // setAddress(accounts[0]);
      return accounts[0];
    } catch (error) {
      console.log(error);
    }
  };

  return { hasMetaMask, handleConnectWalletBtn };
};
