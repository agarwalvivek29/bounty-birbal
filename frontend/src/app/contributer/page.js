/* eslint-disable */

"use client"

// import { useState } from 'react';
// import { Github, Wallet, ExternalLink, Award, GitFork, Flame, Trophy } from 'lucide-react';

// const ContributorDashboard = () => {
//   const [earnings, setEarnings] = useState(1250);
//   const [rank, setRank] = useState(42);
//   const [streak, setStreak] = useState(7);

//   const Avatar = ({ src, alt }) => (
//     <div className="relative inline-block w-35 h-35 mb-4 ring-2 ring-purple-500 rounded-full overflow-hidden">
//       <img src={src} alt={alt} className="w-full h-full object-cover" />
//     </div>
//   );

//   const Badge = ({ variant, children }) => (
//     <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${variant === "success" ? "bg-green-600 text-green-100" : variant === "outline" ? "border border-purple-400 text-purple-400" : variant === "secondary" ? "bg-gray-600 text-gray-200" : "bg-yellow-600 text-yellow-100"}`}>
//       {children}
//     </span>
//   );

//   const Button = ({ children, onClick }) => (
//     <button onClick={onClick} className="py-2 px-4 text-white bg-purple-600 rounded hover:bg-purple-500 transition-colors">
//       {children}
//     </button>
//   );

//   const Card = ({ title, description, children }) => (
//     <div className="bg-gray-800 border border-purple-500 rounded-lg shadow-md p-4 mb-6">
//       <div className="mb-2">
//         <h3 className="text-gray-200 font-bold text-lg">{title}</h3>
//         {description && <p className="text-gray-400 text-sm">{description}</p>}
//       </div>
//       {children}
//     </div>
//   );

//   const Progress = ({ value }) => (
//     <div className="relative w-full h-2 bg-gray-600 rounded">
//       <div className="absolute left-0 top-0 h-2 bg-purple-500 rounded" style={{ width: `${value}%` }}></div>
//     </div>
//   );

//   const Table = ({ children }) => (
//     <table className="min-w-full bg-gray-700">{children}</table>
//   );

//   const TableHeader = ({ children }) => (
//     <thead>{children}</thead>
//   );

//   const TableBody = ({ children }) => (
//     <tbody>{children}</tbody>
//   );

//   const TableRow = ({ children }) => (
//     <tr className="border-b border-gray-600">{children}</tr>
//   );

//   const TableHead = ({ children }) => (
//     <th className="py-2 text-left text-gray-300">{children}</th>
//   );

//   const TableCell = ({ children }) => (
//     <td className="py-2 text-gray-200">{children}</td>
//   );

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 p-6 shadow-md">
//         <div className="flex flex-col items-center mb-6">
//           <Avatar src="https://github.com/shadcn.png" alt="@shadcn" />
//           <h2 className="text-xl font-bold text-gray-100">John Doe</h2>
//           <p className="text-sm text-gray-400">Full-stack Developer</p>
//         </div>
//         <div className="space-y-4">
//           <div className="flex items-center space-x-2 text-gray-300">
//             <Github className="w-5 h-5" />
//             <span className="text-sm">@johndoe</span>
//           </div>
//           <div className="flex items-center space-x-2 text-gray-300">
//             <Wallet className="w-5 h-5" />
//             <span className="text-sm truncate">0x1234...5678</span>
//           </div>
//         </div>
//         <p className="mt-6 text-sm text-gray-400">
//           Passionate about open source and building cool stuff. Always learning, always coding.
//         </p>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-auto">
//         <h1 className="text-3xl font-bold mb-8 text-gray-100">Contributor Dashboard</h1>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {/* Earnings Card */}
//           <Card title="Total Earnings" description="+$250 from last month">
//             <div className="text-2xl font-bold text-gray-100">${earnings}</div>
//             <Award className="h-8 w-8 text-purple-400 mt-2" />
//           </Card>

//           {/* Rank Card */}
//           <Card title="Global Rank" description="Top 5% of contributors">
//             <div className="text-2xl font-bold text-gray-100">#{rank}</div>
//             <Trophy className="h-8 w-8 text-purple-400 mt-2" />
//           </Card>

//           {/* Streak Card */}
//           <Card title="Contribution Streak" description="Days of continuous contribution">
//             <div className="text-2xl font-bold text-gray-100">{streak} days</div>
//             <Progress value={(streak / 30) * 100} className="mt-2" />
//             <Flame className="h-8 w-8 text-purple-400 mt-2" />
//           </Card>
//         </div>

//         {/* Assigned Issues Table */}
//         <Card title="Assigned Issues" description="Issues you're currently working on or assigned to.">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-gray-700">
//                 <TableHead>Issue</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               <TableRow>
//                 <TableCell>
//                   <a href="#" className="text-purple-400 hover:underline">Fix broken links</a>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="success">In Progress</Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Button>View</Button>
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell>
//                   <a href="#" className="text-purple-400 hover:underline">Update README</a>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline">Pending Review</Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Button>View</Button>
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell>
//                   <a href="#" className="text-purple-400 hover:underline">Add new feature</a>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="secondary">Completed</Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Button>View</Button>
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </Card>
//       </main>
//     </div>
//   );
// };

// export default ContributorDashboard;


// import { useState, useEffect } from 'react';
// import { Github, Wallet, Award, Flame, Trophy } from 'lucide-react';
// import { useActiveAccount, useReadContract } from "thirdweb/react";
// import { getContract, defineChain } from "thirdweb";
// import { contractABI } from '../constants/contract';
// import { client } from '../client';

// const contract = getContract({
//   client,
//   chain: defineChain(84532),
//   address: "0x96111652DB352b814697e79A846E8CD9C8e11196",
//   abi: contractABI,
// });

// // Helper function to format BigInt to ETH string
// const formatEth = (wei) => {
//   if (!wei) return '0.00';
//   const ethValue = Number(wei) / 1000000000000;
//   return ethValue;
// };

// const ContributorDashboard = () => {
//   const account = useActiveAccount();
//   const [rank, setRank] = useState(42);
//   const [streak, setStreak] = useState(7);
//   const [assignedIssues, setAssignedIssues] = useState([]);

//   const { data: totalEarnings, isLoading: isEarningsLoading } = useReadContract({
//     contract,
//     method: "function getContributorEarnedfunds(address _address) view returns (uint256)",
//     params: [account?.address]
//   });

//   const { data: bounties, isLoading: isBountiesLoading } = useReadContract({
//     contract,
//     method: "function getBounties() view returns ((uint256 id, string issueLink, uint256 amount, address creator, address rewardedTo, address[] assignedTo, bool isOpen, bool isCompleted, string rewardee_username)[])",
//     params: []
//   });

//   useEffect(() => {
//     if (bounties && account) {
//       const filteredIssues = bounties.filter(bounty => 
//         bounty.rewardedTo === account.address || bounty.assignedTo.includes(account.address)
//       );
//       setAssignedIssues(filteredIssues);
//     }
//   }, [bounties, account]);

//   const Avatar = ({ src, alt }) => (
//     <div className="relative inline-block w-35 h-35 mb-4 ring-2 ring-purple-500 rounded-full overflow-hidden">
//       <img src={src} alt={alt} className="w-full h-full object-cover" />
//     </div>
//   );

//   const Badge = ({ variant, children }) => (
//     <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
//       variant === "success" ? "bg-green-600 text-green-100" : 
//       variant === "outline" ? "border border-purple-400 text-purple-400" : 
//       variant === "secondary" ? "bg-gray-600 text-gray-200" : 
//       "bg-yellow-600 text-yellow-100"
//     }`}>
//       {children}
//     </span>
//   );

//   const Button = ({ children, onClick }) => (
//     <button onClick={onClick} className="py-2 px-4 text-white bg-purple-600 rounded hover:bg-purple-500 transition-colors">
//       {children}
//     </button>
//   );

//   const Card = ({ title, description, children }) => (
//     <div className="bg-gray-800 border border-purple-500 rounded-lg shadow-md p-4 mb-6">
//       <div className="mb-2">
//         <h3 className="text-gray-200 font-bold text-lg">{title}</h3>
//         {description && <p className="text-gray-400 text-sm">{description}</p>}
//       </div>
//       {children}
//     </div>
//   );

//   const Progress = ({ value }) => (
//     <div className="relative w-full h-2 bg-gray-600 rounded">
//       <div className="absolute left-0 top-0 h-2 bg-purple-500 rounded" style={{ width: `${value}%` }}></div>
//     </div>
//   );

//   const Table = ({ children }) => (
//     <table className="min-w-full bg-gray-700">{children}</table>
//   );

//   const TableHeader = ({ children }) => (
//     <thead>{children}</thead>
//   );

//   const TableBody = ({ children }) => (
//     <tbody>{children}</tbody>
//   );

//   const TableRow = ({ children }) => (
//     <tr className="border-b border-gray-600">{children}</tr>
//   );

//   const TableHead = ({ children }) => (
//     <th className="py-2 text-left text-gray-300">{children}</th>
//   );

//   const TableCell = ({ children }) => (
//     <td className="py-2 text-gray-200">{children}</td>
//   );

//   if (!account) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold mb-4">Welcome to the Contributor Dashboard</h1>
//           <p className="mb-8">Please connect your wallet to access the dashboard.</p>
//           {/* Add your wallet connect button here */}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 p-6 shadow-md">
//         <div className="flex flex-col items-center mb-6">
//           <Avatar src="https://github.com/shadcn.png" alt="@shadcn" />
//           <h2 className="text-xl font-bold text-gray-100">John Doe</h2>
//           <p className="text-sm text-gray-400">Full-stack Developer</p>
//         </div>
//         <div className="space-y-4">
//           <div className="flex items-center space-x-2 text-gray-300">
//             <Github className="w-5 h-5" />
//             <span className="text-sm">@johndoe</span>
//           </div>
//           <div className="flex items-center space-x-2 text-gray-300">
//             <Wallet className="w-5 h-5" />
//             <span className="text-sm truncate">{account.address}</span>
//           </div>
//         </div>
//         <p className="mt-6 text-sm text-gray-400">
//           Passionate about open source and building cool stuff. Always learning, always coding.
//         </p>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-auto">
//         <h1 className="text-3xl font-bold mb-8 text-gray-100">Contributor Dashboard</h1>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {/* Earnings Card */}
//           <Card title="Total Earnings" description="Your total earnings from contributions">
//             <div className="text-2xl font-bold text-gray-100">
//               {isEarningsLoading ? 'Loading...' : `${formatEth(totalEarnings)} ETH`}
//             </div>
//             <Award className="h-8 w-8 text-purple-400 mt-2" />
//           </Card>

//           {/* Rank Card */}
//           <Card title="Global Rank" description="Top 5% of contributors">
//             <div className="text-2xl font-bold text-gray-100">#{rank}</div>
//             <Trophy className="h-8 w-8 text-purple-400 mt-2" />
//           </Card>

//           {/* Streak Card */}
//           <Card title="Contribution Streak" description="Days of continuous contribution">
//             <div className="text-2xl font-bold text-gray-100">{streak} days</div>
//             <Progress value={(streak / 30) * 100} />
//             <Flame className="h-8 w-8 text-purple-400 mt-2" />
//           </Card>
//         </div>

//         {/* Assigned Issues Table */}
//         <Card title="Assigned Issues" description="Issues you're currently working on or assigned to.">
//           {isBountiesLoading ? (
//             <p>Loading assigned issues...</p>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Issue</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {assignedIssues.map((issue) => (
//                   <TableRow key={issue.id}>
//                     <TableCell>
//                       <a href={issue.issueLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
//                         {issue.issueLink}
//                       </a>
//                     </TableCell>
//                     <TableCell>{formatEth(issue.amount)} ETH</TableCell>
//                     <TableCell>
//                       <Badge variant={issue.isCompleted ? "secondary" : issue.isOpen ? "success" : "outline"}>
//                         {issue.isCompleted ? "Completed" : issue.isOpen ? "In Progress" : "Pending Review"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Button onClick={() => window.open(issue.issueLink, '_blank')}>View</Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </Card>
//       </main>
//     </div>
//   );
// };

// export default ContributorDashboard;


import { useState, useEffect } from 'react';
import { Github, Wallet, Award, Flame, Trophy } from 'lucide-react';
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getContract, defineChain } from "thirdweb";
import { contractABI } from '../constants/contract';
import { client } from '../client';

const contract = getContract({
  client,
  chain: defineChain(84532),
  address: "0x96111652DB352b814697e79A846E8CD9C8e11196",
  abi: contractABI,
});

// Helper function to format BigInt to ETH string
const formatEth = (wei) => {
  if (!wei) return '0.00';
  const ethValue = Number(wei) / (10 ** 18);
  return ethValue;
};

const ContributorDashboard = () => {
  const account = useActiveAccount();
  const [rank, setRank] = useState(42);
  const [streak, setStreak] = useState(7);
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [userData, setUserData] = useState(null);

  const { data: totalEarnings, isLoading: isEarningsLoading } = useReadContract({
    contract,
    method: "function getContributorEarnedfunds(address _address) view returns (uint256)",
    params: [account?.address]
  });

  const { data: bounties, isLoading: isBountiesLoading } = useReadContract({
    contract,
    method: "function getBounties() view returns ((uint256 id, string issueLink, uint256 amount, address creator, address rewardedTo, address[] assignedTo, bool isOpen, bool isCompleted, string rewardee_username)[])",
    params: []
  });

  useEffect(() => {
    if (bounties && account) {
      const filteredIssues = bounties.filter(bounty => 
        bounty.rewardedTo === account.address || bounty.assignedTo.includes(account.address)
      );
      setAssignedIssues(filteredIssues);

      // Fetch GitHub user data
      if (filteredIssues.length > 0) {
        const rewardee_username = filteredIssues[0].rewardee_username;
        fetch(`https://api.github.com/users/${rewardee_username}`)
          .then(response => response.json())
          .then(data => setUserData(data))
          .catch(error => console.error('Error fetching GitHub data:', error));
      }
    }
  }, [bounties, account]);

  const Avatar = ({ src, alt }) => (
    <div className="relative inline-block w-35 h-35 mb-4 ring-2 ring-purple-500 rounded-full overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );

  const Badge = ({ variant, children }) => (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
      variant === "success" ? "bg-green-600 text-green-100" : 
      variant === "outline" ? "border border-purple-400 text-purple-400" : 
      variant === "secondary" ? "bg-gray-600 text-gray-200" : 
      "bg-yellow-600 text-yellow-100"
    }`}>
      {children}
    </span>
  );

  const Button = ({ children, onClick }) => (
    <button onClick={onClick} className="py-2 px-4 text-white bg-purple-600 rounded hover:bg-purple-500 transition-colors">
      {children}
    </button>
  );

  const Card = ({ title, description, children }) => (
    <div className="bg-gray-800 border border-purple-500 rounded-lg shadow-md p-4 mb-6">
      <div className="mb-2">
        <h3 className="text-gray-200 font-bold text-lg">{title}</h3>
        {description && <p className="text-gray-400 text-sm">{description}</p>}
      </div>
      {children}
    </div>
  );

  const Progress = ({ value }) => (
    <div className="relative w-full h-2 bg-gray-600 rounded">
      <div className="absolute left-0 top-0 h-2 bg-purple-500 rounded" style={{ width: `${value}%` }}></div>
    </div>
  );

  const Table = ({ children }) => (
    <table className="min-w-full bg-gray-700">{children}</table>
  );

  const TableHeader = ({ children }) => (
    <thead>{children}</thead>
  );

  const TableBody = ({ children }) => (
    <tbody>{children}</tbody>
  );

  const TableRow = ({ children }) => (
    <tr className="border-b border-gray-600">{children}</tr>
  );

  const TableHead = ({ children }) => (
    <th className="py-2 text-left text-gray-300">{children}</th>
  );

  const TableCell = ({ children }) => (
    <td className="py-2 text-gray-200">{children}</td>
  );

  if (!account) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Contributor Dashboard</h1>
          <p className="mb-8">Please connect your wallet to access the dashboard.</p>
          {/* Add your wallet connect button here */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 shadow-md">
        <div className="flex flex-col items-center mb-6">
          <Avatar src={userData?.avatar_url || "https://github.com/shadcn.png"} alt={userData?.login || "@shadcn"} />
          <h2 className="text-xl font-bold text-gray-100">{userData?.name || "Loading..."}</h2>
          <p className="text-sm text-gray-400">{userData?.bio || "GitHub Contributor"}</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <Github className="w-5 h-5" />
            <span className="text-sm">@{userData?.login || "Loading..."}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Wallet className="w-5 h-5" />
            <span className="text-sm truncate">{account.address}</span>
          </div>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          {userData?.bio || "Passionate about open source and building cool stuff. Always learning, always coding."}
        </p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">Contributor Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Earnings Card */}
          <Card title="Total Earnings" description="Your total earnings from contributions">
            <div className="text-2xl font-bold text-gray-100">
              {isEarningsLoading ? 'Loading...' : `${formatEth(totalEarnings)} ETH`}
            </div>
            <Award className="h-8 w-8 text-purple-400 mt-2" />
          </Card>

          {/* Rank Card */}
          <Card title="Global Rank" description="Top 5% of contributors">
            <div className="text-2xl font-bold text-gray-100">#{rank}</div>
            <Trophy className="h-8 w-8 text-purple-400 mt-2" />
          </Card>

          {/* Streak Card */}
          <Card title="Contribution Streak" description="Days of continuous contribution">
            <div className="text-2xl font-bold text-gray-100">{streak} days</div>
            <Progress value={(streak / 30) * 100} />
            <Flame className="h-8 w-8 text-purple-400 mt-2" />
          </Card>
        </div>

        {/* Assigned Issues Table */}
        <Card title="Assigned Issues" description="Issues you're currently working on or assigned to.">
          {isBountiesLoading ? (
            <p>Loading assigned issues...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <a href={issue.issueLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                        {issue.issueLink}
                      </a>
                    </TableCell>
                    <TableCell>{formatEth(issue.amount)} ETH</TableCell>
                    <TableCell>
                      <Badge variant={issue.isCompleted ? "secondary" : issue.isOpen ? "success" : "outline"}>
                        {issue.isCompleted ? "Completed" : issue.isOpen ? "In Progress" : "Pending Review"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => window.open(issue.issueLink, '_blank')}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>
    </div>
  );
};

export default ContributorDashboard;