/* eslint-disable */

"use client"


import React, { useState, useEffect } from 'react';
import { BarChart, Calendar, Github, Search, Wallet } from 'lucide-react';
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { contractABI } from '../constants/contract';
import { defineChain, getContract, prepareContractCall } from "thirdweb";
import { ethers } from 'ethers';
import { client } from '../client';
import Manager from "../../../Manager.jpg"

const contract = getContract({
  client,
  chain: defineChain(84532),
  address: "0x96111652DB352b814697e79A846E8CD9C8e11196",
  abi: contractABI,
});

const Avatar = ({ src, alt }) => (
  <div className="relative inline-block w-35 h-35 mb-4 ring-2 ring-purple-500 rounded-full overflow-hidden">
    <img src={src} alt={alt} className="w-full h-full object-cover" />
  </div>
);

function Select({ options, value, onChange }) {
  return (
    <select className="bg-gray-700 text-gray-200 border-gray-600" value={value} onChange={e => onChange(e.target.value)}>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  )
}

function Card({ children, className }) {
  return (
    <div className={`p-4 rounded-lg shadow-lg bg-gray-800 border-purple-500 ${className}`}>
      {children}
    </div>
  )
}

const ManagerDashboard = () => {
  const account = useActiveAccount();
  const [filterBounty, setFilterBounty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const { mutate: sendTransaction } = useSendTransaction();

  const { data: bountiesData, isPending: isBountiesPending } = useReadContract({
    contract, 
    method: "function getBountiesByMaintainer(address _maintainer) view returns ((uint256 id, string issueLink, uint256 amount, address creator, address rewardedTo, address[] assignedTo, bool isOpen, bool isCompleted, string rewardee_username)[])",
    params: [account?.address]
  });

  const { data: fundsData, isPending: isFundsPending } = useReadContract({
    contract, 
    method: "function maintainers(address) view returns (uint256 totalFunds, uint256 blockedFounds, uint256 availableFunds)",
    params: [account?.address]
  });

  const { data: bountyCountData, isPending: isBountyCountPending } = useReadContract({
    contract, 
    method: "function maintainerBounties(address, uint256) view returns (uint256)",
    params: [account?.address, 0]
  });

  const [bounties, setBounties] = useState([]);
  const [funds, setFunds] = useState({ totalFunds: 0, blockedFunds: 0, availableFunds: 0 });
  const [bountyCount, setBountyCount] = useState(0);

  useEffect(() => {
    console.log('Account:', account);
    
    if (bountiesData && !isBountiesPending) {
      console.log('Bounties Data:', bountiesData);
      setBounties(bountiesData);
    }
    if (fundsData && !isFundsPending) {
      console.log('Funds Data:', fundsData);
      setFunds({
        totalFunds: Number(fundsData[0].toString())/(10 ** 18),  
        blockedFunds: Number(fundsData[1].toString())/(10 ** 18), 
        availableFunds: Number(fundsData[2].toString())/(10 ** 18) 
      });
      console.log("totalFunds", funds.totalFunds);
    }
    if (bountyCountData && !isBountyCountPending) {
      console.log('Bounty Count Data:', bountyCountData);
      setBountyCount(bountyCountData);
    }

    console.log('Is Bounties Pending:', isBountiesPending);
    console.log('Is Funds Pending:', isFundsPending);
    console.log('Is Bounty Count Pending:', isBountyCountPending);

  }, [account, bountiesData, fundsData, bountyCountData, isBountiesPending, isFundsPending, isBountyCountPending]);

  useEffect(() => {
    console.log('Updated Bounties:', bounties);
    console.log('Updated Funds:', funds);
    console.log('Updated Bounty Count:', bountyCount);
  }, [bounties, funds, bountyCount]);

  const filteredBounties = bounties.filter(bounty => 
    (filterBounty === "all" || (filterBounty === "bounty" && bounty.isOpen) || (filterBounty === "non-bounty" && !bounty.isOpen)) &&
    (filterStatus === "all" || (filterStatus === "open" && bounty.isOpen) || (filterStatus === "closed" && !bounty.isOpen)) &&
    (bounty.issueLink.toLowerCase().includes(searchTerm.toLowerCase()) || bounty.rewardee_username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log('Filtered Bounties:', filteredBounties);

  const handleDepositFunds = async () => {
    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }
  
    try {
      const valueInWei = parseFloat(depositAmount) * 1e18;
      
      const transaction = prepareContractCall({
        contract,
        method: "function depositFunds() payable",
        params: [],
        value: valueInWei
      });
      
      const tx = await sendTransaction(transaction);
      alert("Deposit transaction sent successfully, wait for wallet to pop up!");
      setDepositAmount("");
      
      await tx.wait();
      alert("Deposit confirmed!");
      
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  }

  const handleAddToGitHub = () => {
    window.open('https://github.com/apps/bounty-birbal-bot/installations/new', '_blank');
  };

  if (!account) {
    console.log('No account connected');
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Maintainer's Dashboard</h1>
          <p className="mb-8">Please connect your wallet to access the dashboard.</p>
          {/* Add your wallet connect button here */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <Avatar src="https://api.dicebear.com/6.x/bottts/svg?seed=Octocat" alt="@shadcn" />
          <h2 className="text-xl font-bold text-gray-100">Maintainer</h2>
          <p className="text-sm text-gray-400">Open Source Visionary</p>
        </div>
        <div className="mb-6 space-y-2">
          <div className="flex items-center">
            <Github className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-sm text-gray-300">Maman08</span>
          </div>
          <div className="flex items-center">
            <Wallet className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-sm text-gray-300 truncate">{account.address}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-sm text-gray-300">Joined: N/A</span>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6">
          <h3 className="font-semibold mb-2 text-gray-200">About</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Passionate about creating inclusive and innovative open source solutions.
          </p>
        </div>
        {/* Add to GitHub button */}
        <div className="mt-6">
          <button
            onClick={handleAddToGitHub}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            <Github className="w-4 h-4 mr-2" />
            Add to GitHub
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">Maintainer's Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex justify-between pb-2">
              <span className="text-sm text-gray-300">Available Funds</span>
              <Wallet className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl text-gray-100">ETH{funds.availableFunds.toString()}</div>
            <p className="text-xs text-gray-400 mt-1">Last updated: Now</p>
          </Card>
          <Card>
            <div className="flex justify-between pb-2">
              <span className="text-sm text-gray-300">Total Funds</span>
              <BarChart className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl text-gray-100">ETH{funds.totalFunds.toString()}</div>
            <p className="text-xs text-gray-400 mt-1">Blocked: ETH{funds.blockedFunds.toString()}</p>
          </Card>
          <Card>
            <div className="flex justify-between pb-2">
              <span className="text-sm text-gray-300">Open Bounties</span>
              <Github className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl text-gray-100">{bounties.filter(bounty => bounty.isOpen).length}</div>
          </Card>
          <Card>
            <div className="flex justify-between pb-2">
              <span className="text-sm text-gray-300">Deposit Funds</span>
              <Wallet className="w-4 h-4 text-purple-400" />
            </div>
            <input
              type="number"
              placeholder="Amount in ETH"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-2 mb-2 bg-gray-700 text-gray-200 border border-gray-600 rounded"
            />
            <button 
              onClick={handleDepositFunds}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded w-full"
            >
              Deposit Funds
            </button>
          </Card>
        </div>

        {/* Bounties table */}
        <Card>
          <div>
            <span className="text-gray-100">Project Bounties</span>
            <span className="text-gray-400">Manage and track your bounties</span>
          </div>
          <div className="mb-4">
            <div className="mb-4">
              <label htmlFor="filter-bounty" className="text-gray-300">Bounty Status</label>
              <Select 
                options={[{ value: "all", label: "All" }, { value: "bounty", label: "Open" }, { value: "non-bounty", label: "Closed" }]} 
                value={filterBounty} 
                onChange={setFilterBounty} 
              />
            </div>
            <div>
              <label htmlFor="filter-status" className="text-gray-300">Completion Status</label>
              <Select 
                options={[{ value: "all", label: "All" }, { value: "open", label: "Incomplete" }, { value: "closed", label: "Completed" }]} 
                value={filterStatus} 
                onChange={setFilterStatus} 
              />
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search bounties..." 
                className="bg-gray-700 text-gray-200 border-gray-600 w-full p-2 rounded-lg" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
              <Search className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          <table className="table-auto w-full text-left text-gray-300">
            <thead>
              <tr>
                <th>Issue Link</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Rewarded To</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {filteredBounties.map(bounty => (
                <tr key={bounty.id}>
                  <td>{bounty.issueLink}</td>
                  <td>ETH{Number(bounty.amount.toString())/(10 ** 18)}</td>
                  <td>{bounty.isOpen ? 'Open' : 'Closed'}</td>
                  <td>{bounty.rewardee_username || 'Not Assigned'}</td>
                  <td>{bounty.isCompleted ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;





// import React, { useState, useEffect } from 'react';
// import { BarChart, Calendar, Github, Search, Wallet } from 'lucide-react';
// import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
// import { contractABI } from '../constants/contract';
// import { defineChain, getContract, prepareContractCall } from "thirdweb";
// import { ethers } from 'ethers';
// import { client } from '../client';
// import Manager from "../../../Manager.jpg"
// const contract = getContract({
//   client,
//   chain: defineChain(84532),
//   address: "0x96111652DB352b814697e79A846E8CD9C8e11196",
//   abi: contractABI,
// });

// const Avatar = ({ src, alt }) => (
//   <div className="relative inline-block w-35 h-35 mb-4 ring-2 ring-purple-500 rounded-full overflow-hidden">
//     <img src={src} alt={alt} className="w-full h-full object-cover" />
//   </div>
// );

// function Select({ options, value, onChange }) {
//   return (
//     <select className="bg-gray-700 text-gray-200 border-gray-600" value={value} onChange={e => onChange(e.target.value)}>
//       {options.map(option => (
//         <option key={option.value} value={option.value}>{option.label}</option>
//       ))}
//     </select>
//   )
// }

// function Card({ children, className }) {
//   return (
//     <div className={`p-4 rounded-lg shadow-lg bg-gray-800 border-purple-500 ${className}`}>
//       {children}
//     </div>
//   )
// }

// const ManagerDashboard = () => {
//   const account = useActiveAccount();
//   const [filterBounty, setFilterBounty] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [depositAmount, setDepositAmount] = useState("");
//   const { mutate: sendTransaction } = useSendTransaction();

//   // Fetch bounties by maintainer
//   const { data: bountiesData, isPending: isBountiesPending } = useReadContract({
//     contract, 
//     method: "function getBountiesByMaintainer(address _maintainer) view returns ((uint256 id, string issueLink, uint256 amount, address creator, address rewardedTo, address[] assignedTo, bool isOpen, bool isCompleted, string rewardee_username)[])",
//     params: [account?.address]
//   });

//   // Fetch maintainer funds
//   const { data: fundsData, isPending: isFundsPending } = useReadContract({
//     contract, 
//     method: "function maintainers(address) view returns (uint256 totalFunds, uint256 blockedFounds, uint256 availableFunds)",
//     params: [account?.address]
//   });

//   // Fetch maintainer bounties count
//   const { data: bountyCountData, isPending: isBountyCountPending } = useReadContract({
//     contract, 
//     method: "function maintainerBounties(address, uint256) view returns (uint256)",
//     params: [account?.address, 0] // Assuming 0 is a valid index, adjust if needed
//   });

//   const [bounties, setBounties] = useState([]);
//   const [funds, setFunds] = useState({ totalFunds: 0, blockedFunds: 0, availableFunds: 0 });
//   const [bountyCount, setBountyCount] = useState(0);

//   useEffect(() => {
//     console.log('Account:', account);
    
//     if (bountiesData && !isBountiesPending) {
//       console.log('Bounties Data:', bountiesData);
//       setBounties(bountiesData);
//     }
//     if (fundsData && !isFundsPending) {
//       console.log('Funds Data:', fundsData);
//       setFunds({
//         totalFunds: Number(fundsData[0].toString())/1000000000000,  
//         blockedFunds: Number(fundsData[1].toString())/1000000000000, 
//         availableFunds: Number(fundsData[2].toString())/1000000000000 
//       });
//       console.log("totalFunds", funds.totalFunds);
//     }
//     if (bountyCountData && !isBountyCountPending) {
//       console.log('Bounty Count Data:', bountyCountData);
//       setBountyCount(bountyCountData);
//     }

//     console.log('Is Bounties Pending:', isBountiesPending);
//     console.log('Is Funds Pending:', isFundsPending);
//     console.log('Is Bounty Count Pending:', isBountyCountPending);

//   }, [account, bountiesData, fundsData, bountyCountData, isBountiesPending, isFundsPending, isBountyCountPending]);

//   useEffect(() => {
//     console.log('Updated Bounties:', bounties);
//     console.log('Updated Funds:', funds);
//     console.log('Updated Bounty Count:', bountyCount);
//   }, [bounties, funds, bountyCount]);

//   const filteredBounties = bounties.filter(bounty => 
//     (filterBounty === "all" || (filterBounty === "bounty" && bounty.isOpen) || (filterBounty === "non-bounty" && !bounty.isOpen)) &&
//     (filterStatus === "all" || (filterStatus === "open" && bounty.isOpen) || (filterStatus === "closed" && !bounty.isOpen)) &&
//     (bounty.issueLink.toLowerCase().includes(searchTerm.toLowerCase()) || bounty.rewardee_username.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   console.log('Filtered Bounties:', filteredBounties);

 
//   const handleDepositFunds = async () => {
//     // Input validation
//     if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
//       alert("Please enter a valid deposit amount.");
//       return;
//     }
  
//     try {
//       // Convert ETH to Wei (1 ETH = 10^18 Wei)
//       const valueInWei = parseFloat(depositAmount) * 1e18;
      
//       const transaction = prepareContractCall({
//         contract,
//         method: "function depositFunds() payable",
//         params: [],
//         value: valueInWei
//       });
      
//       const tx = await sendTransaction(transaction);
//       alert("Deposit transaction sent successfully,wait for wallet to pop up!");
//       setDepositAmount("");
      
//       // Optionally wait for transaction confirmation
//        await tx.wait();
//       alert("Deposit confirmed!");
      
//     } catch (error) {
//       console.error("Deposit failed:", error);
//     }
//   }
  

//   if (!account) {
//     console.log('No account connected');
//     return (
//       <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold mb-4">Welcome to the Maintainer's Dashboard</h1>
//           <p className="mb-8">Please connect your wallet to access the dashboard.</p>
//           {/* Add your wallet connect button here */}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-800 p-6 shadow-lg">
//         <div className="flex flex-col items-center mb-6">
//           <Avatar src="https://api.dicebear.com/6.x/bottts/svg?seed=Octocat" alt="@shadcn" />
//           <h2 className="text-xl font-bold text-gray-100">Maintainer</h2>
//           <p className="text-sm text-gray-400">Open Source Visionary</p>
//         </div>
//         <div className="mb-6 space-y-2">
//           <div className="flex items-center">
//             <Github className="w-4 h-4 mr-2 text-purple-400" />
//             <span className="text-sm text-gray-300">Maman08</span>
//           </div>
//           <div className="flex items-center">
//             <Wallet className="w-4 h-4 mr-2 text-purple-400" />
//             <span className="text-sm text-gray-300 truncate">{account.address}</span>
//           </div>
//           <div className="flex items-center">
//             <Calendar className="w-4 h-4 mr-2 text-purple-400" />
//             <span className="text-sm text-gray-300">Joined: N/A</span>
//           </div>
//         </div>
//         <div className="border-t border-gray-700 pt-6">
//           <h3 className="font-semibold mb-2 text-gray-200">About</h3>
//           <p className="text-sm text-gray-400 leading-relaxed">
//             Passionate about creating inclusive and innovative open source solutions.
//           </p>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 p-8 overflow-auto">
//         <h1 className="text-3xl font-bold mb-8 text-gray-100">Maintainer's Dashboard</h1>

//         {/* Stats cards */}
//         <div className="grid grid-cols-3 gap-6 mb-8">
//           <Card>
//             <div className="flex justify-between pb-2">
//               <span className="text-sm text-gray-300">Available Funds</span>
//               <Wallet className="w-4 h-4 text-purple-400" />
//             </div>
//             <div className="text-2xl text-gray-100">ETH{funds.availableFunds.toString()}</div>
//             <p className="text-xs text-gray-400 mt-1">Last updated: Now</p>
//           </Card>
//           <Card>
//             <div className="flex justify-between pb-2">
//               <span className="text-sm text-gray-300">Total Funds</span>
//               <BarChart className="w-4 h-4 text-purple-400" />
//             </div>
//             <div className="text-2xl text-gray-100">ETH{funds.totalFunds.toString()}</div>
//             <p className="text-xs text-gray-400 mt-1">Blocked: ETH{funds.blockedFunds.toString()}</p>
//           </Card>
//           <Card>
//             <div className="flex justify-between pb-2">
//               <span className="text-sm text-gray-300">Open Bounties</span>
//               <Github className="w-4 h-4 text-purple-400" />
//             </div>
//             <div className="text-2xl text-gray-100">{bounties.filter(bounty => bounty.isOpen).length}</div>
//           </Card>
//           <Card>
//             <div className="flex justify-between pb-2">
//               <span className="text-sm text-gray-300">Deposit Funds</span>
//               <Wallet className="w-4 h-4 text-purple-400" />
//             </div>
//             <input
//               type="number"
//               placeholder="Amount in ETH"
//               value={depositAmount}
//               onChange={(e) => setDepositAmount(e.target.value)}
//               className="w-full p-2 mb-2 bg-gray-700 text-gray-200 border border-gray-600 rounded"
//             />
//             <button 
//               onClick={handleDepositFunds}
//               className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded w-full"
//             >
//               Deposit Funds
//             </button>
//           </Card>
//         </div>

//         {/* Bounties table */}
//         <Card>
//           <div>
//             <span className="text-gray-100">Project Bounties</span>
//             <span className="text-gray-400">Manage and track your bounties</span>
//           </div>
//           <div className="mb-4">
//             <div className="mb-4">
//               <label htmlFor="filter-bounty" className="text-gray-300">Bounty Status</label>
//               <Select 
//                 options={[{ value: "all", label: "All" }, { value: "bounty", label: "Open" }, { value: "non-bounty", label: "Closed" }]} 
//                 value={filterBounty} 
//                 onChange={setFilterBounty} 
//               />
//             </div>
//             <div>
//               <label htmlFor="filter-status" className="text-gray-300">Completion Status</label>
//               <Select 
//                 options={[{ value: "all", label: "All" }, { value: "open", label: "Incomplete" }, { value: "closed", label: "Completed" }]} 
//                 value={filterStatus} 
//                 onChange={setFilterStatus} 
//               />
//             </div>
//             <div className="relative">
//               <input 
//                 type="text" 
//                 placeholder="Search bounties..." 
//                 className="bg-gray-700 text-gray-200 border-gray-600 w-full p-2 rounded-lg" 
//                 value={searchTerm} 
//                 onChange={e => setSearchTerm(e.target.value)} 
//               />
//               <Search className="absolute right-3 top-3 text-gray-400" />
//             </div>
//           </div>
//           <table className="table-auto w-full text-left text-gray-300">
//             <thead>
//               <tr>
//                 <th>Issue Link</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Rewarded To</th>
//                 <th>Completed</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredBounties.map(bounty => (
//                 <tr key={bounty.id}>
//                   <td>{bounty.issueLink}</td>
//                   <td>ETH{Number(bounty.amount.toString())/1000000000000}</td>
//                   <td>{bounty.isOpen ? 'Open' : 'Closed'}</td>
//                   <td>{bounty.rewardee_username || 'Not Assigned'}</td>
//                   <td>{bounty.isCompleted ? 'Yes' : 'No'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;



