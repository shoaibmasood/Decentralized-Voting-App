"use client";

import Moralis from "moralis-v1";
import { createContext, useContext, useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/navigation";
import { ADMIN_ADDRESS } from "../constants/constants";

const AppContext = createContext(undefined);

export function AppContextWrapper({ children }) {
  const { account, deactivateWeb3, isWeb3Enabled } = useMoralis();
  const router = useRouter();

  console.log("context account", account, isWeb3Enabled);

  //check if user has  switched  accounts
  useEffect(() => {
    Moralis.onAccountChanged((newAccount) => {
      console.log(`Account changed to ${newAccount}`);
      if (newAccount == null) {
        window.localStorage.removeItem("connected");
        router.push("/");
        deactivateWeb3();
        console.log("Null Account found");
      }
    });
  }, []);

  useEffect(() => {
    if (account != ADMIN_ADDRESS.toLowerCase() && account) {
      router.push("/voterView");
    } else if (isWeb3Enabled) {
      router.push("/dashboard");
    }
  }, [account]);

  return (
    <AppContext.Provider value={{ account }}>{children}</AppContext.Provider>
  );
}

export default AppContext;

export const useAppContext = () => useContext(AppContext);
