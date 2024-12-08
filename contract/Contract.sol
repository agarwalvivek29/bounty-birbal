// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OpenSourceBountyDispenser {
    struct Bounty {
        uint256 id;
        string issueLink;
        uint256 amount; // Amount stored in wei
        address creator;
        address payable rewardedTo;
        address[] assignedTo;
        bool isOpen;
        bool isCompleted;
        string rewardee_username;
    }
    
    struct Maintainer {
        uint256 totalFunds; // Funds stored in wei
        uint256 blockedFunds; // Funds locked in bounties
        uint256 availableFunds; // Funds available for new bounties or withdrawal
    }

    struct Contributor {
        uint256 earnedFunds; // Earned bounty funds stored in wei
    }

    // State variables
    uint256 public bountyCounter;
    address public platformAdmin;
    
    // Mappings
    mapping(address => Maintainer) public maintainers;
    mapping(address => Contributor) public contributors;
    mapping(uint256 => Bounty) public bounties;
    mapping(address => uint256[]) public maintainerBounties;
    mapping(address => uint256[]) public contributorBounties;
    mapping(string => address) public githubUsers;

    // Events for logging activities
    event BountyCreated(uint256 bountyId, address creator, uint256 amount, string issueLink);
    event BountyAssigned(uint256 bountyId, address contributor);
    event BountyCompleted(uint256 bountyId, address contributor, uint256 payout);
    event BountyDeleted(uint256 bountyId, address creator);
    event FundsDeposited(address maintainer, uint256 amount);
    event FundsWithdrawn(address maintainer, uint256 amount);

    modifier onlyMaintainer() {
        require(maintainers[msg.sender].totalFunds > 0, "Not a registered maintainer");
        _;
    }

    modifier onlyPlatformAdmin() {
        require(msg.sender == platformAdmin, "Not platform admin");
        _;
    }

    constructor() {
        platformAdmin = msg.sender;
        bountyCounter = 1; // Start from 1 to avoid issues with 0 index
    }

    function registerUser(string memory _githubUsername) external {
        githubUsers[_githubUsername] = msg.sender;

        uint256 length = bountyCounter;
        for (uint256 i = 1; i < length; i++) {
            Bounty storage bounty = bounties[i];
            if (keccak256(abi.encodePacked(bounty.rewardee_username)) == keccak256(abi.encodePacked(_githubUsername)) && bounty.rewardedTo == address(0)) {
                bounty.rewardedTo = payable(msg.sender);
                contributors[msg.sender].earnedFunds += bounty.amount;

                payable(bounty.rewardedTo).transfer(bounty.amount);

                maintainers[bounty.creator].blockedFunds -= bounty.amount;
                emit BountyCompleted(i, bounty.rewardedTo, bounty.amount);
            }
        }
    }

    // Allow maintainers to deposit Ether into the contract
    function depositFunds() external payable {
        maintainers[msg.sender].totalFunds += msg.value;
        maintainers[msg.sender].availableFunds += msg.value;

        emit FundsDeposited(msg.sender, msg.value);
    }

    // Create a new bounty with Ether as the reward amount
    function createBounty(uint _amountEther, uint _decimalPlace, string memory _issueLink, string memory _maintainer) external onlyPlatformAdmin {
        uint256 amountWei = _amountEther * 1 ether / 10**_decimalPlace; // Convert from ether to wei
        require(amountWei > 0, "Bounty amount must be greater than zero");
        address maintainer_address = githubUsers[_maintainer];
        require(maintainers[maintainer_address].availableFunds >= amountWei, "Insufficient funds for bounty");


        Bounty memory newBounty = Bounty({
            id: bountyCounter,
            issueLink: _issueLink,
            amount: amountWei, // Store the amount in wei
            creator: maintainer_address,
            rewardedTo: payable(address(0)),
            assignedTo: new address[](0),
            isOpen: true,
            isCompleted: false,
            rewardee_username: ''
        });

        bounties[bountyCounter] = newBounty;
        maintainerBounties[maintainer_address].push(bountyCounter);

        maintainers[maintainer_address].blockedFunds += amountWei;
        maintainers[maintainer_address].availableFunds -= amountWei;

        emit BountyCreated(bountyCounter, msg.sender, amountWei, _issueLink);
        bountyCounter++;
    }

    // Assign a contributor to a bounty
    function assignContributor(uint256 _bountyId, string memory _contributor) external onlyPlatformAdmin {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.isOpen, "Bounty is not open");
        address contributor_address = githubUsers[_contributor];
        require(contributor_address != address(0), "Contributor not registered");
        
        for (uint256 i = 0; i < bounty.assignedTo.length; i++) {
            require(bounty.assignedTo[i] != contributor_address, "Contributor already assigned");
        }
        
        bounty.assignedTo.push(contributor_address);

        emit BountyAssigned(_bountyId, contributor_address);
    }

    // Complete a bounty and pay the contributor
    function completeBounty(uint256 _bountyId, string memory _contributor) external onlyPlatformAdmin {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.isOpen, "Bounty is not open");
        require(bounty.rewardedTo == address(0), "Bounty already completed by someone else");
        
        bounty.isOpen = false;
        bounty.isCompleted = true;
        bounty.rewardee_username = _contributor;
        
        address contributor_address = githubUsers[_contributor];
        require(contributor_address != address(0), "User is not registered on the platform");

        bounty.rewardedTo = payable(contributor_address);
        contributors[contributor_address].earnedFunds += bounty.amount;
        payable(bounty.rewardedTo).transfer(bounty.amount);

        maintainers[bounty.creator].blockedFunds -= bounty.amount;

        emit BountyCompleted(_bountyId, bounty.rewardedTo, bounty.amount);
    }

    // Allow a maintainer to withdraw their available funds in Ether
    function withdrawFunds(uint256 _amountEther, uint256 _decimalPlace) external onlyMaintainer {
        uint256 amountWei = _amountEther * 1 ether / 10**_decimalPlace; // Convert ether to wei
        require(maintainers[msg.sender].availableFunds >= amountWei, "Insufficient available funds");
        maintainers[msg.sender].availableFunds -= amountWei;
        payable(msg.sender).transfer(amountWei);

        emit FundsWithdrawn(msg.sender, amountWei);
    }

    // Revert any direct payments to the contract
    receive() external payable {
        revert("Direct payments not allowed");
    }

    // Get all the bounties in the contract
    function getBounties() external view returns (Bounty[] memory) {
        Bounty[] memory allBounties = new Bounty[](bountyCounter - 1);
        for (uint256 i = 1; i < bountyCounter; i++) {
            allBounties[i - 1] = bounties[i];
        }
        return allBounties;
    }

    // Get all bounties created by a specific maintainer
    function getBountiesByMaintainer(address _maintainer) external view returns (Bounty[] memory) {
        uint256[] memory bountyIds = maintainerBounties[_maintainer];
        Bounty[] memory result = new Bounty[](bountyIds.length);

        for (uint256 i = 0; i < bountyIds.length; i++) {
            result[i] = bounties[bountyIds[i]];
        }
        return result;
    }

    // Get the funds for a maintainer
    function getMaintainerFunds(string memory _maintainer) external view returns (uint256 totalFunds, uint256 blockedFunds, uint256 availableFunds) {
        address maintainerAddress = githubUsers[_maintainer]; // Convert GitHub username to address
        require(maintainerAddress != address(0), "Maintainer not found"); // Check if the maintainer exists

        Maintainer memory m = maintainers[maintainerAddress]; // Retrieve maintainer details using the address
        return (m.totalFunds, m.blockedFunds, m.availableFunds); // Return funds
    }

    // Get the earned funds of a contributor
    function getContributorEarnedfunds(address _address) external view returns (uint256) {
        Contributor memory contributor = contributors[_address];
        return contributor.earnedFunds;
    }

    // Change the platform administrator
    function changePlatformAdmin(address _newAdmin) external onlyPlatformAdmin {
        require(_newAdmin != address(0), "Invalid address");
        platformAdmin = _newAdmin;
    }
}
