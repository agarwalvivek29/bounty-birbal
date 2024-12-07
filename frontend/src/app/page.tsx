"use client"

import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import {createWallet} from "thirdweb/wallets"
import { defineChain,getContract,resolveMethod } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import Link from 'next/link';
import HomePage from "./components/Home";
export default function Home() {
  // connect to your contract
 const contract = getContract({
  client,
  chain: defineChain(84532),
  address: "0x96111652DB352b814697e79A846E8CD9C8e11196"
});

console.log("contract : ",contract)


  return (
    <main>
      <HomePage/>
    </main>
  );
}



