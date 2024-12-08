import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import dotenv from "dotenv";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { readContract } from "thirdweb";

dotenv.config();

const chainId = 84532

// console.log(process.env.CLIENT_SECRET);
// console.log(process.env.WALLET_PRIVATE_KEY);

// create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({
  clientId: process.env.CLIENT_ID as string,
});

export const account = privateKeyToAccount({
    client,
    privateKey: process.env.WALLET_PRIVATE_KEY as string,
});
  
// connect to your contract
export const contract = getContract({
  client,
  chain: defineChain(84532),
  address: "0x96111652DB352b814697e79A846E8CD9C8e11196"
});

export async function createBounty( _amountEther: unknown, _decimalPlace: unknown, _issueLink: string, _maintainer: string) {
    
  try{
    const transaction = await prepareContractCall({
      contract,
      method: "function createBounty(uint256 _amountEther, uint256 _decimalPlace, string _issueLink, string _maintainer)",
      params: [_amountEther as bigint, _decimalPlace as bigint, _issueLink, _maintainer]
    });
    const { transactionHash } = await sendTransaction({
        transaction,
        account
    });

    return transactionHash;
  }
  catch (error: any) {
    console.error(error);
    return;
  }
}

export async function rewardBounty( _issueLink: string, _contributor: string) {
  const _bountyId: unknown = await getBountyId(_issueLink);

  if ( !_bountyId ) {
    console.log('Invalid bounty ID');
    return;
  }

  try {
    const transaction = await prepareContractCall({
      contract,
      method: "function completeBounty(uint256 _bountyId, string _contributor)",
      params: [_bountyId as bigint, _contributor]
    });
    const { transactionHash } = await sendTransaction({
      transaction,
      account
    });
  
    return transactionHash;
  }
  catch (error: any) {
    console.error(error);
    return;
  }
}

export async function getBountyId( _issueLink: string) {
  const bounties = await getBounties();
  const bounty = bounties.find((bounty: any) => bounty.issueLink === _issueLink);
  
  if ( !bounty || !bounty.id ) {
    console.log('Bounty not found');
    return;
  }

  return bounty.id;
}

export async function getBounties ( ) {
  try{
    const data = await readContract({
      contract,
      method: "function getBounties() view returns ((uint256 id, string issueLink, uint256 amount, address creator, address rewardedTo, address[] assignedTo, bool isOpen, bool isCompleted, string rewardee_username)[])",
      params: []
    })
  
    return data;
  }
  catch (error: any) {
    console.error(error);
    return [];
  }
}

export async function assignContributor ( _bountyId: bigint, _contributor: string) {

  if ( !_bountyId ) {
    console.log('Invalid bounty ID');
    return;
  }

  try{
    const transaction = await prepareContractCall({
      contract,
      method: "function assignContributor(uint256 _bountyId, string _contributor)",
      params: [_bountyId, _contributor]
    });
    const { transactionHash } = await sendTransaction({
      transaction,
      account
    });
    
    return transactionHash;
  }
  catch (error: any) {
    console.error(error);
    return;
  }
}