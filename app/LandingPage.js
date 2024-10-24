"use client";
import Image from "next/image";
import landingImage from "../public/4585.jpg";
import ConnectButton from "./components/ConnectButton/ConnectButton";
export default function Home() {
  return (
    <main>
      <section className=" text-gray-600 body-font p-[85px] ">
        <div className="container bg-slate-100 rounded-2xl mx-auto flex px-10 py-24  md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Decentralized Voting App
              <br className="hidden lg:inline-block" />
              Using BlockChain
            </h1>
            <p className="mb-8 leading-relaxed">
              Explore a new era of secure, transparent and tamper-proof voting.
              <br />
            </p>
            <div className="flex justify-center">
              <ConnectButton />
              {/* <button className="inline-flex text-white bg-green-500 border-0 py-2 px-12 focus:outline-none hover:bg-green-600 rounded text-lg">Connect Wallet</button> */}
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <Image
              className="object-cover object-center rounded-2xl"
              alt="hero"
              src={landingImage}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
