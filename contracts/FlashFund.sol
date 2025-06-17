// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title FlashFund
 * @dev A decentralized crowdfunding platform
 * @author Shangesh
 */

contract FlashFund is ReentrancyGuard, Ownable, Pausable {
    uint256 public totalCampaigns = 0;
    uint256 public platformFeePercent = 250; // 2.5%
    uint256 public accumulatedFees;

    uint256 public constant MINIMUM_DURATION_DAYS = 1;
    uint256 public constant MAXIMUM_DURATION_DAYS = 365;
    uint256 public constant MINIMUM_DONATION_ETHER = 0.001 ether;
    uint256 public constant MAX_FEE_PERCENT = 1000; // 10%

    struct CampaignStruct {
        uint256 id;
        address creator;
        string title;
        string description;
        string image;
        string author;
        uint256 goalAmount;
        uint256 deadline;
        uint256 raisedAmount;
        bool isActive;
        bool fundsClaimed;
        bool isCancelled;
        uint256 createdAt;
    }

    mapping(uint256 => CampaignStruct) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;

    event CampaignCreated(uint256 indexed campaignId, address indexed creator);

    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event FundsClaimed(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );

    event RefundProcessed(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event CampaignCancelled(
        uint256 indexed campaignId,
        address indexed creator
    );

    modifier validCampaign(uint256 _campaignId) {
        require(
            campaigns[_campaignId].creator != address(0),
            "Campaign does not exist"
        );
        _;
    }

    modifier activeCampaign(uint256 _campaignId) {
        require(campaigns[_campaignId].isActive, "Campaign not active");
        require(!campaigns[_campaignId].isCancelled, "Campaign is cancelled");
        _;
    }

    modifier onlyCreator(uint256 _campaignId) {
        require(
            msg.sender == campaigns[_campaignId].creator,
            "Only creator can call this"
        );
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create a new crowdfunding campaign
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _image Campaign image URL
     * @param _author Campaign author name
     * @param _goalAmountEther Goal amount in Ether
     * @param _durationDays Campaign duration in days
     * @return campaignId The ID of the created campaign
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _image,
        string memory _author,
        uint256 _goalAmountEther,
        uint256 _durationDays
    ) external whenNotPaused returns (uint256) {
        require(
            bytes(_title).length > 0 && bytes(_title).length <= 100,
            "Invalid title length"
        );
        require(
            bytes(_description).length > 0 && bytes(_description).length <= 500,
            "Invalid description length"
        );
        require(_goalAmountEther > 0, "Goal must be greater than 0");
        require(_durationDays >= MINIMUM_DURATION_DAYS, "Duration too short");
        require(_durationDays <= MAXIMUM_DURATION_DAYS, "Duration too long");

        totalCampaigns++;
        uint256 campaignId = totalCampaigns;
        uint256 campaignDeadline = block.timestamp + (_durationDays * 1 days);
        uint256 goalInWei = _goalAmountEther * 1 ether;

        campaigns[campaignId] = CampaignStruct({
            id: campaignId,
            creator: msg.sender,
            title: _title,
            description: _description,
            image: _image,
            author: _author,
            goalAmount: goalInWei,
            deadline: campaignDeadline,
            raisedAmount: 0,
            isActive: true,
            fundsClaimed: false,
            isCancelled: false,
            createdAt: block.timestamp
        });

        emit CampaignCreated(campaignId, msg.sender);
        return campaignId;
    }

    /**
     * @notice Donate to a campaign
     * @param _campaignId Campaign ID to donate
     */
    function donate(
        uint256 _campaignId
    )
        external
        payable
        nonReentrant
        whenNotPaused
        validCampaign(_campaignId)
        activeCampaign(_campaignId)
    {
        CampaignStruct storage campaign = campaigns[_campaignId];

        require(block.timestamp <= campaign.deadline, "Campaign expired");
        require(msg.value >= MINIMUM_DONATION_ETHER, "Donation too small");
        require(
            msg.sender != campaign.creator,
            "Creator cannot donate to own campaign"
        );

        donations[_campaignId][msg.sender] += msg.value;
        campaign.raisedAmount += msg.value;

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    /**
     * @notice Claim funds for successful campaign
     * @param _campaignId Campaign ID to claim funds
     */
    function claimFunds(
        uint256 _campaignId
    )
        external
        nonReentrant
        validCampaign(_campaignId)
        onlyCreator(_campaignId)
    {
        CampaignStruct storage campaign = campaigns[_campaignId];

        require(campaign.isActive, "Campaign not active");
        require(!campaign.isCancelled, "Campaign is cancelled");
        require(!campaign.fundsClaimed, "Funds already claimed");
        require(block.timestamp >= campaign.deadline, "Campaign still running");
        require(
            campaign.raisedAmount >= campaign.goalAmount,
            "Goal not reached"
        );

        uint256 platformFee = (campaign.raisedAmount * platformFeePercent) /
            10000;
        uint256 creatorAmount = campaign.raisedAmount - platformFee;

        campaign.isActive = false;
        campaign.fundsClaimed = true;
        accumulatedFees += platformFee;

        (bool success, ) = payable(campaign.creator).call{value: creatorAmount}(
            ""
        );
        require(success, "Transfer failed");

        emit FundsClaimed(_campaignId, msg.sender, creatorAmount);
    }

    /**
     * @notice Cancel an active campaign
     * @param _campaignId Campaign ID to cancel
     */
    function cancelCampaign(
        uint256 _campaignId
    )
        external
        validCampaign(_campaignId)
        onlyCreator(_campaignId)
        activeCampaign(_campaignId)
    {
        CampaignStruct storage campaign = campaigns[_campaignId];

        require(block.timestamp < campaign.deadline, "Campaign already ended");
        require(!campaign.fundsClaimed, "Funds already claimed");

        campaign.isActive = false;
        campaign.isCancelled = true;

        emit CampaignCancelled(_campaignId, msg.sender);
    }

    /**
     * @notice Claim refund for failed or cancelled campaign
     * @param _campaignId Campaign ID to claim refund
     */
    function claimRefund(
        uint256 _campaignId
    ) external nonReentrant validCampaign(_campaignId) {
        CampaignStruct storage campaign = campaigns[_campaignId];

        require(
            (block.timestamp > campaign.deadline &&
                campaign.raisedAmount < campaign.goalAmount) ||
                campaign.isCancelled,
            "Cannot claim refund"
        );

        uint256 donationAmount = donations[_campaignId][msg.sender];
        require(donationAmount > 0, "No donation found");

        donations[_campaignId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: donationAmount}("");
        require(success, "Refund failed");

        emit RefundProcessed(_campaignId, msg.sender, donationAmount);
    }

    /**
     * @notice Withdraw accumulated platform fees (only owner)
     */
    function withdrawFees() external onlyOwner nonReentrant {
        require(accumulatedFees > 0, "No fees to withdraw");

        uint256 feesToWithdraw = accumulatedFees;
        accumulatedFees = 0;

        (bool success, ) = payable(owner()).call{value: feesToWithdraw}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice Update platform fee percentage (only owner)
     * @param _newFeePercent New fee percentage in basis points
     */
    function updateFeePercent(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= MAX_FEE_PERCENT, "Fee cannot exceed 10%");
        platformFeePercent = _newFeePercent;
    }

    /**
     * @notice Pause contract (emergency stop) (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Get a specific campaign by ID
     * @param _campaignId Campaign ID to retrieve
     * @return CampaignStruct Campaign details
     */
    function getCampaign(
        uint256 _campaignId
    ) external view validCampaign(_campaignId) returns (CampaignStruct memory) {
        return campaigns[_campaignId];
    }

    /**
     * @notice Get all campaigns
     * @return CampaignStruct[] Array of all campaigns
     */
    function getAllCampaigns() external view returns (CampaignStruct[] memory) {
        CampaignStruct[] memory allCampaigns = new CampaignStruct[](
            totalCampaigns
        );

        for (uint256 i = 0; i < totalCampaigns; i++) {
            allCampaigns[i] = campaigns[i + 1];
        }

        return allCampaigns;
    }

    /**
     * @notice Get donation amount for a specific donor and campaign
     * @param _campaignId Campaign ID
     * @param _donor Donor address
     * @return uint256 Donation amount
     */
    function getDonation(
        uint256 _campaignId,
        address _donor
    ) external view returns (uint256) {
        return donations[_campaignId][_donor];
    }

    /**
     * @notice Returns the current balance of the contract
     * @return uint256 Contract balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Fallbacks and Receive to prevent accidental ETH transfers from EOA
     */
    receive() external payable {
        revert("Direct ETH not allowed");
    }

    fallback() external payable {
        revert("Invalid call");
    }
}
