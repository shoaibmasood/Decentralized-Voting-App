"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_ADDRESS } from "../constants/constants";

const AppContext = createContext(undefined);

//Get Connected account to wallet
export const checkIfWalletIsConnected = async () => {
  const account = await window.ethereum.request({ method: "eth_accounts" });

  if (account.length) {
    return account[0];
  } else {
    console.log("Please Install MetaMask & Connect, Reload");
  }
};

export function AppContextWrapper({ children }) {
  const [address, setAddress] = useState(null);
  const router = useRouter();

  const handleOnAccountChanged = (newAccount) => {
    console.log(`Account changed to ${newAccount[0]}`);
    if (newAccount.length == 0) {
      console.log("Wallet is Disconnected");
      setAddress(null);
      window.localStorage.removeItem("connected");
      router.push("/");
    } else {
      console.log("New Acount Changed to", newAccount[0]);
      window, localStorage.setItem("connected", newAccount[0]);
      setAddress(newAccount[0]);
    }
  };

  console.log("address", address);

  // check if user has  switched  accounts
  useEffect(() => {
    window.ethereum.on("accountsChanged", handleOnAccountChanged);

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener(
          "accountsChanged",
          handleOnAccountChanged
        );
      }
    };
  }, []);

  useEffect(() => {
    if (address == ADMIN_ADDRESS.toLowerCase() && address) {
      router.push("/dashboard");
    } else if (address) {
      router.push("/voterView");
    }
  }, [address]);

  return (
    <AppContext.Provider
      value={{ address, setAddress, checkIfWalletIsConnected }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;

export const useAppContext = () => useContext(AppContext);
