// scripts/interact.js
const hre = require("hardhat");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

async function main() {
    console.log("FlashFund Contract Interaction Script");
    console.log("=====================================");

    // Get signers for different roles
    const [owner, creator, donor1, donor2] = await ethers.getSigners();
    console.log(`Owner: ${owner.address}`);
    console.log(`Creator: ${creator.address}`);
    console.log(`Donor1: ${donor1.address}`);
    console.log(`Donor2: ${donor2.address}`);
    console.log("-------------------------------------");
    let flashFund;
    let contractAddress = "0x6925452287Cd2828522027095F6Cb372F275f0Cc";


    const FlashFund = await ethers.getContractFactory("FlashFund");
    flashFund = FlashFund.attach(contractAddress);
    console.log(`Connected to existing contract at: ${contractAddress}`);


    // Test 1: Create a campaign
    console.log("Test 1: Creating a campaign");
    try {
        const tx = await flashFund.connect(creator).createCampaign(
            "Test Campaign",      // title
            "This is a test campaign to demonstrate the functionality", // description
            "https://example.com/image.jpg", // image
            "John Doe",           // author
            1,                    // goalAmount in Ether (1 ETH)
            30                    // duration in days
        );
        await tx.wait();
        console.log("Campaign created successfully!");

        // Get campaign details
        const campaignId = await flashFund.campaignCounter();
        console.log(`Campaign ID: ${campaignId}`);

        const campaign = await flashFund.getCampaign(campaignId);
        console.log(`Title: ${campaign.title}`);
        console.log(`Creator: ${campaign.creator}`);
        console.log(`Goal Amount: ${ethers.formatEther(campaign.goalAmount)} ETH`);
        console.log(`Deadline: ${new Date(Number(campaign.deadline) * 1000).toLocaleString()}`);
    } catch (error) {
        console.error("Error creating campaign:", error.message);
    }
    console.log("-------------------------------------");

    // Test 2: Make donations
    console.log("Test 2: Making donations");
    try {
        const campaignId = await flashFund.campaignCounter();

        // Donation from donor1
        const donationAmount1 = ethers.parseEther("0.5");
        const tx1 = await flashFund.connect(donor1).donate(campaignId, { value: donationAmount1 });
        await tx1.wait();
        console.log(`Donor1 donated: ${ethers.formatEther(donationAmount1)} ETH`);

        // Donation from donor2
        const donationAmount2 = ethers.parseEther("0.6");
        const tx2 = await flashFund.connect(donor2).donate(campaignId, { value: donationAmount2 });
        await tx2.wait();
        console.log(`Donor2 donated: ${ethers.formatEther(donationAmount2)} ETH`);

        // Check campaign raised amount
        const campaign = await flashFund.getCampaign(campaignId);
        console.log(`Total raised: ${ethers.formatEther(campaign.raisedAmount)} ETH`);

        // Check individual donations
        const donation1 = await flashFund.donations(campaignId, donor1.address);
        const donation2 = await flashFund.donations(campaignId, donor2.address);
        console.log(`Donor1 donation record: ${ethers.formatEther(donation1)} ETH`);
        console.log(`Donor2 donation record: ${ethers.formatEther(donation2)} ETH`);
    } catch (error) {
        console.error("Error making donations:", error.message);
    }
    console.log("-------------------------------------");

    // Test 3: Test edge case - Creator can't donate to own campaign
    console.log("Test 3: Testing creator donation restriction");
    try {
        const campaignId = await flashFund.campaignCounter();
        await flashFund.connect(creator).donate(campaignId, { value: ethers.parseEther("0.1") });
        console.log("UNEXPECTED: Creator was able to donate to own campaign!");
    } catch (error) {
        console.log("Expected error:", error.message.includes("Creator cannot donate") ? "Creator cannot donate to own campaign" : error.message);
    }
    console.log("-------------------------------------");

    // Test 4: Test edge case - Donation below minimum
    console.log("Test 4: Testing minimum donation amount");
    try {
        const campaignId = await flashFund.campaignCounter();
        await flashFund.connect(donor1).donate(campaignId, { value: ethers.parseEther("0.0005") });
        console.log("UNEXPECTED: Donation below minimum was accepted!");
    } catch (error) {
        console.log("Expected error:", error.message.includes("Donation too small") ? "Donation too small" : error.message);
    }
    console.log("-------------------------------------");

    // Test 5: Creating a new campaign with edge case values
    console.log("Test 5: Testing campaign creation with edge case values");
    try {
        // Campaign with minimum duration
        const tx = await flashFund.connect(creator).createCampaign(
            "Edge Case Campaign",
            "Testing with minimum values",
            "https://example.com/image.jpg",
            "Jane Doe",
            0.1,                  // small goal amount
            1                     // minimum duration
        );
        await tx.wait();
        const campaignId = await flashFund.campaignCounter();
        console.log(`Created edge case campaign with ID: ${campaignId}`);

        const campaign = await flashFund.getCampaign(campaignId);
        console.log(`Duration: ${(Number(campaign.deadline) - Number(campaign.createdAt)) / 86400} days`);
    } catch (error) {
        console.error("Error creating edge case campaign:", error.message);
    }
    console.log("-------------------------------------");

    // Test 6: Cancel a campaign
    console.log("Test 6: Cancelling a campaign");
    try {
        const campaignId = await flashFund.campaignCounter();
        const tx = await flashFund.connect(creator).cancelCampaign(campaignId);
        await tx.wait();

        const campaign = await flashFund.getCampaign(campaignId);
        console.log(`Campaign cancelled: ${campaign.isCancelled}`);
        console.log(`Campaign active: ${campaign.isActive}`);
    } catch (error) {
        console.error("Error cancelling campaign:", error.message);
    }
    console.log("-------------------------------------");

    // Test 7: Claim refund
    console.log("Test 7: Claiming refund from cancelled campaign");
    try {
        const campaignId = await flashFund.campaignCounter() - 1; // Using first campaign that has donations

        // Check donor1's balance before refund
        const balanceBefore = await ethers.provider.getBalance(donor1.address);
        console.log(`Donor1 balance before refund: ${ethers.formatEther(balanceBefore)} ETH`);

        // Claim refund
        const tx = await flashFund.connect(donor1).claimRefund(campaignId);
        await tx.wait();

        // Check donor1's balance after refund
        const balanceAfter = await ethers.provider.getBalance(donor1.address);
        console.log(`Donor1 balance after refund: ${ethers.formatEther(balanceAfter)} ETH`);

        // Check donation record
        const donation = await flashFund.donations(campaignId, donor1.address);
        console.log(`Donor1 donation record after refund: ${ethers.formatEther(donation)} ETH`);
    } catch (error) {
        console.error("Error claiming refund:", error.message);
    }
    console.log("-------------------------------------");

    // Test 8: Successful campaign and fund claiming
    console.log("Test 8: Successful campaign completion and fund claiming");
    try {
        // Create a new campaign with small goal
        const tx1 = await flashFund.connect(creator).createCampaign(
            "Successful Campaign",
            "This campaign will reach its goal",
            "https://example.com/image.jpg",
            "Success Author",
            0.2,                  // small goal amount (0.2 ETH)
            5                     // short duration
        );
        await tx1.wait();
        const campaignId = await flashFund.campaignCounter();
        console.log(`Created campaign with ID: ${campaignId}`);

        // Make donations exceeding the goal
        const donationAmount = ethers.parseEther("0.3"); // More than the goal
        const tx2 = await flashFund.connect(donor1).donate(campaignId, { value: donationAmount });
        await tx2.wait();
        console.log(`Donated ${ethers.formatEther(donationAmount)} ETH (exceeds goal)`);

        // Fast-forward time to end the campaign
        console.log("Fast-forwarding time to end the campaign...");
        await hre.network.provider.send("evm_increaseTime", [6 * 24 * 60 * 60]); // 6 days
        await hre.network.provider.send("evm_mine");

        // Check creator's balance before claiming funds
        const balanceBefore = await ethers.provider.getBalance(creator.address);
        console.log(`Creator balance before claiming: ${ethers.formatEther(balanceBefore)} ETH`);

        // Claim funds
        const tx3 = await flashFund.connect(creator).claimFunds(campaignId);
        await tx3.wait();

        // Check creator's balance after claiming funds
        const balanceAfter = await ethers.provider.getBalance(creator.address);
        console.log(`Creator balance after claiming: ${ethers.formatEther(balanceAfter)} ETH`);

        // Check campaign status
        const campaign = await flashFund.getCampaign(campaignId);
        console.log(`Campaign active: ${campaign.isActive}`);
        console.log(`Funds claimed: ${campaign.fundsClaimed}`);

        // Check platform fees
        const fees = await flashFund.accumulatedFees();
        console.log(`Accumulated platform fees: ${ethers.formatEther(fees)} ETH`);
    } catch (error) {
        console.error("Error in successful campaign flow:", error.message);
    }
    console.log("-------------------------------------");

    // Test 9: Platform fee withdrawal
    console.log("Test 9: Testing platform fee withdrawal");
    try {
        // Check owner's balance before withdrawal
        const balanceBefore = await ethers.provider.getBalance(owner.address);
        console.log(`Owner balance before fee withdrawal: ${ethers.formatEther(balanceBefore)} ETH`);

        // Withdraw fees
        const tx = await flashFund.connect(owner).withdrawFees();
        await tx.wait();

        // Check owner's balance after withdrawal
        const balanceAfter = await ethers.provider.getBalance(owner.address);
        console.log(`Owner balance after fee withdrawal: ${ethers.formatEther(balanceAfter)} ETH`);

        // Check accumulated fees
        const fees = await flashFund.accumulatedFees();
        console.log(`Accumulated fees after withdrawal: ${ethers.formatEther(fees)} ETH`);
    } catch (error) {
        console.error("Error withdrawing fees:", error.message);
    }
    console.log("-------------------------------------");

    // Test 10: Update platform fee percentage
    console.log("Test 10: Updating platform fee percentage");
    try {
        // Check current fee percentage
        const currentFee = await flashFund.platformFeePercent();
        console.log(`Current fee percentage: ${currentFee / 100}%`);

        // Update fee percentage
        const newFeePercent = 500; // 5%
        const tx = await flashFund.connect(owner).updateFeePercent(newFeePercent);
        await tx.wait();

        // Check updated fee percentage
        const updatedFee = await flashFund.platformFeePercent();
        console.log(`Updated fee percentage: ${updatedFee / 100}%`);
    } catch (error) {
        console.error("Error updating fee percentage:", error.message);
    }
    console.log("-------------------------------------");

    // Test 11: Pause and unpause contract
    console.log("Test 11: Testing pause functionality");
    try {
        // Pause contract
        await flashFund.connect(owner).pause();
        console.log(`Contract paused: ${await flashFund.paused()}`);

        // Try to create a campaign while paused
        try {
            await flashFund.connect(creator).createCampaign(
                "Paused Test",
                "This should fail",
                "https://example.com/image.jpg",
                "Pause Author",
                1,
                30
            );
            console.log("UNEXPECTED: Created campaign while contract is paused!");
        } catch (error) {
            console.log("Expected error:", error.message.includes("EnforcedPause") ? "Contract is paused" : error.message);
        }

        // Unpause contract
        await flashFund.connect(owner).unpause();
        console.log(`Contract paused: ${await flashFund.paused()}`);

        // Create campaign after unpausing
        const tx = await flashFund.connect(creator).createCampaign(
            "Unpaused Test",
            "This should succeed",
            "https://example.com/image.jpg",
            "Unpause Author",
            1,
            30
        );
        await tx.wait();
        console.log("Successfully created campaign after unpausing");
    } catch (error) {
        console.error("Error testing pause functionality:", error.message);
    }
    console.log("-------------------------------------");

    // Test 12: Check failed campaign and refund
    console.log("Test 12: Testing failed campaign scenario");
    try {
        // Create a campaign
        const tx1 = await flashFund.connect(creator).createCampaign(
            "Failed Campaign",
            "This campaign will not reach its goal",
            "https://example.com/image.jpg",
            "Failure Author",
            5,                    // 5 ETH goal
            2                     // 2 days duration
        );
        await tx1.wait();
        const campaignId = await flashFund.campaignCounter();
        console.log(`Created campaign with ID: ${campaignId}`);

        // Make donation below goal
        const donationAmount = ethers.parseEther("1"); // Less than the goal
        const tx2 = await flashFund.connect(donor1).donate(campaignId, { value: donationAmount });
        await tx2.wait();
        console.log(`Donated ${ethers.formatEther(donationAmount)} ETH (below goal)`);

        // Fast-forward time to end the campaign
        console.log("Fast-forwarding time to end the campaign...");
        await hre.network.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]); // 3 days
        await hre.network.provider.send("evm_mine");

        // Try to claim funds (should fail)
        try {
            await flashFund.connect(creator).claimFunds(campaignId);
            console.log("UNEXPECTED: Creator claimed funds from failed campaign!");
        } catch (error) {
            console.log("Expected error:", error.message.includes("Goal not reached") ? "Goal not reached" : error.message);
        }

        // Claim refund
        const balanceBefore = await ethers.provider.getBalance(donor1.address);
        const tx3 = await flashFund.connect(donor1).claimRefund(campaignId);
        await tx3.wait();
        const balanceAfter = await ethers.provider.getBalance(donor1.address);

        console.log(`Donor received refund: approximately ${ethers.formatEther(balanceAfter - balanceBefore)} ETH`);
    } catch (error) {
        console.error("Error in failed campaign scenario:", error.message);
    }
    console.log("-------------------------------------");

    // Test 13: Check contract balance
    console.log("Test 13: Checking contract balance");
    try {
        const balance = await flashFund.getContractBalance();
        console.log(`Contract balance: ${ethers.formatEther(balance)} ETH`);
    } catch (error) {
        console.error("Error getting contract balance:", error.message);
    }
    console.log("-------------------------------------");

    console.log("FlashFund interaction tests completed!");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});