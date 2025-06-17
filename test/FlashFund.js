const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("FlashFund", function () {
  async function deployFlashFundFixture() {
    const [owner, creator, donor1, donor2, donor3] = await ethers.getSigners();
    const FlashFund = await ethers.getContractFactory("FlashFund");
    const flashFund = await FlashFund.deploy();

    return { flashFund, owner, creator, donor1, donor2, donor3 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { flashFund, owner } = await loadFixture(deployFlashFundFixture);
      expect(await flashFund.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct default values", async function () {
      const { flashFund } = await loadFixture(deployFlashFundFixture);
      expect(await flashFund.campaignCounter()).to.equal(0);
      expect(await flashFund.platformFeePercent()).to.equal(250);
      expect(await flashFund.accumulatedFees()).to.equal(0);
      expect(await flashFund.paused()).to.equal(false);
    });
  });

  describe("Campaign Creation", function () {
    it("Should create campaign with valid parameters", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(creator).createCampaign(
        "Test Campaign",
        "Test Description",
        "https://image.com",
        "Test Author",
        10,
        30
      )).to.emit(flashFund, "CampaignCreated")
        .withArgs(1, creator.address);

      const campaign = await flashFund.getCampaign(1);
      expect(campaign.title).to.equal("Test Campaign");
      expect(campaign.creator).to.equal(creator.address);
      expect(campaign.goalAmount).to.equal(ethers.parseEther("10"));
      expect(campaign.isActive).to.equal(true);
    });

    it("Should increment campaign counter", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Campaign 1", "Desc", "img", "Author", 5, 10);
      expect(await flashFund.campaignCounter()).to.equal(1);

      await flashFund.connect(creator).createCampaign("Campaign 2", "Desc", "img", "Author", 5, 10);
      expect(await flashFund.campaignCounter()).to.equal(2);
    });

    it("Should revert with empty title", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(creator).createCampaign(
        "",
        "Description",
        "image",
        "Author",
        10,
        30
      )).to.be.revertedWith("Invalid title length");
    });

    it("Should revert with title too long", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);
      const longTitle = "a".repeat(101);

      await expect(flashFund.connect(creator).createCampaign(
        longTitle,
        "Description",
        "image",
        "Author",
        10,
        30
      )).to.be.revertedWith("Invalid title length");
    });

    it("Should revert with empty description", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(creator).createCampaign(
        "Title",
        "",
        "image",
        "Author",
        10,
        30
      )).to.be.revertedWith("Invalid description length");
    });

    it("Should revert with description too long", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);
      const longDesc = "a".repeat(501);

      await expect(flashFund.connect(creator).createCampaign(
        "Title",
        longDesc,
        "image",
        "Author",
        10,
        30
      )).to.be.revertedWith("Invalid description length");
    });

    it("Should revert with zero goal amount", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(creator).createCampaign(
        "Title",
        "Description",
        "image",
        "Author",
        0,
        30
      )).to.be.revertedWith("Goal must be greater than 0");
    });

    it("Should revert with duration too short", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(creator).createCampaign(
        "Title",
        "Description",
        "image",
        "Author",
        10,
        0
      )).to.be.revertedWith("Duration too short");
    });

    it("Should revert with duration too long", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(creator).createCampaign(
        "Title",
        "Description",
        "image",
        "Author",
        10,
        366
      )).to.be.revertedWith("Duration too long");
    });

    it("Should revert when contract is paused", async function () {
      const { flashFund, owner, creator } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(owner).pause();

      await expect(flashFund.connect(creator).createCampaign(
        "Title",
        "Description",
        "image",
        "Author",
        10,
        30
      )).to.be.revertedWithCustomError(flashFund, "EnforcedPause");
    });
  });

  describe("Donations", function () {
    async function createCampaignFixture() {
      const { flashFund, owner, creator, donor1, donor2, donor3 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign(
        "Test Campaign",
        "Test Description",
        "https://image.com",
        "Test Author",
        10,
        30
      );

      return { flashFund, owner, creator, donor1, donor2, donor3 };
    }

    it("Should accept valid donation", async function () {
      const { flashFund, donor1 } = await loadFixture(createCampaignFixture);
      const donationAmount = ethers.parseEther("1");

      await expect(flashFund.connect(donor1).donate(1, { value: donationAmount }))
        .to.emit(flashFund, "DonationReceived")
        .withArgs(1, donor1.address, donationAmount);

      const campaign = await flashFund.getCampaign(1);
      expect(campaign.raisedAmount).to.equal(donationAmount);
      expect(await flashFund.donations(1, donor1.address)).to.equal(donationAmount);
    });

    it("Should accumulate multiple donations from same donor", async function () {
      const { flashFund, donor1 } = await loadFixture(createCampaignFixture);

      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("1") });
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("2") });

      expect(await flashFund.donations(1, donor1.address)).to.equal(ethers.parseEther("3"));
    });

    it("Should revert for non-existent campaign", async function () {
      const { flashFund, donor1 } = await loadFixture(createCampaignFixture);

      await expect(flashFund.connect(donor1).donate(999, { value: ethers.parseEther("1") }))
        .to.be.revertedWith("Campaign does not exist");
    });

    it("Should revert for donation below minimum", async function () {
      const { flashFund, donor1 } = await loadFixture(createCampaignFixture);

      await expect(flashFund.connect(donor1).donate(1, { value: ethers.parseEther("0.0005") }))
        .to.be.revertedWith("Donation too small");
    });

    it("Should revert when creator tries to donate to own campaign", async function () {
      const { flashFund, creator } = await loadFixture(createCampaignFixture);

      await expect(flashFund.connect(creator).donate(1, { value: ethers.parseEther("1") }))
        .to.be.revertedWith("Creator cannot donate to own campaign");
    });

    it("Should revert for expired campaign", async function () {
      const { flashFund, donor1 } = await loadFixture(createCampaignFixture);

      await time.increase(31 * 24 * 60 * 60); // 31 days

      await expect(flashFund.connect(donor1).donate(1, { value: ethers.parseEther("1") }))
        .to.be.revertedWith("Campaign expired");
    });

    it("Should revert for cancelled campaign", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(createCampaignFixture);

      await flashFund.connect(creator).cancelCampaign(1);

      await expect(flashFund.connect(donor1).donate(1, { value: ethers.parseEther("1") }))
        .to.be.revertedWith("Campaign is cancelled");
    });

    it("Should revert when contract is paused", async function () {
      const { flashFund, owner, donor1 } = await loadFixture(createCampaignFixture);

      await flashFund.connect(owner).pause();

      await expect(flashFund.connect(donor1).donate(1, { value: ethers.parseEther("1") }))
        .to.be.revertedWithCustomError(flashFund, "EnforcedPause");
    });
  });

  describe("Claim Funds", function () {
    async function successfulCampaignFixture() {
      const { flashFund, owner, creator, donor1, donor2, donor3 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("5") });
      await flashFund.connect(donor2).donate(1, { value: ethers.parseEther("6") });

      await time.increase(31 * 24 * 60 * 60);

      return { flashFund, owner, creator, donor1, donor2, donor3 };
    }

    it("Should allow creator to claim funds for successful campaign", async function () {
      const { flashFund, creator } = await loadFixture(successfulCampaignFixture);

      const initialBalance = await ethers.provider.getBalance(creator.address);
      const raisedAmount = ethers.parseEther("11");
      const platformFee = (raisedAmount * 250n) / 10000n;
      const creatorAmount = raisedAmount - platformFee;

      await expect(flashFund.connect(creator).claimFunds(1))
        .to.emit(flashFund, "FundsClaimed")
        .withArgs(1, creator.address, creatorAmount);

      const campaign = await flashFund.getCampaign(1);
      expect(campaign.isActive).to.equal(false);
      expect(campaign.fundsClaimed).to.equal(true);
      expect(await flashFund.accumulatedFees()).to.equal(platformFee);
    });

    it("Should revert if goal not reached", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("5") });
      await time.increase(31 * 24 * 60 * 60);

      await expect(flashFund.connect(creator).claimFunds(1))
        .to.be.revertedWith("Goal not reached");
    });

    it("Should revert if campaign still running", async function () {
      const { flashFund, creator } = await loadFixture(successfulCampaignFixture);

      await time.increase(-31 * 24 * 60 * 60); // Reset time

      await expect(flashFund.connect(creator).claimFunds(1))
        .to.be.revertedWith("Campaign still running");
    });

    it("Should revert if funds already claimed", async function () {
      const { flashFund, creator } = await loadFixture(successfulCampaignFixture);

      await flashFund.connect(creator).claimFunds(1);

      await expect(flashFund.connect(creator).claimFunds(1))
        .to.be.revertedWith("Funds already claimed");
    });

    it("Should revert if not creator", async function () {
      const { flashFund, donor1 } = await loadFixture(successfulCampaignFixture);

      await expect(flashFund.connect(donor1).claimFunds(1))
        .to.be.revertedWith("Only creator can call this");
    });

    it("Should revert for cancelled campaign", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("11") });
      await flashFund.connect(creator).cancelCampaign(1);
      await time.increase(31 * 24 * 60 * 60);

      await expect(flashFund.connect(creator).claimFunds(1))
        .to.be.revertedWith("Campaign is cancelled");
    });
  });

  describe("Cancel Campaign", function () {
    async function activeCampaignFixture() {
      const { flashFund, owner, creator, donor1, donor2, donor3 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("2") });

      return { flashFund, owner, creator, donor1, donor2, donor3 };
    }

    it("Should allow creator to cancel active campaign", async function () {
      const { flashFund, creator } = await loadFixture(activeCampaignFixture);

      await expect(flashFund.connect(creator).cancelCampaign(1))
        .to.emit(flashFund, "CampaignCancelled")
        .withArgs(1, creator.address);

      const campaign = await flashFund.getCampaign(1);
      expect(campaign.isActive).to.equal(false);
      expect(campaign.isCancelled).to.equal(true);
    });

    it("Should revert if not creator", async function () {
      const { flashFund, donor1 } = await loadFixture(activeCampaignFixture);

      await expect(flashFund.connect(donor1).cancelCampaign(1))
        .to.be.revertedWith("Only creator can call this");
    });

    it("Should revert if campaign already ended", async function () {
      const { flashFund, creator } = await loadFixture(activeCampaignFixture);

      await time.increase(31 * 24 * 60 * 60);

      await expect(flashFund.connect(creator).cancelCampaign(1))
        .to.be.revertedWith("Campaign already ended");
    });

    it("Should revert for non-existent campaign", async function () {
      const { flashFund, creator } = await loadFixture(activeCampaignFixture);

      await expect(flashFund.connect(creator).cancelCampaign(999))
        .to.be.revertedWith("Campaign does not exist");
    });
  });

  describe("Claim Refund", function () {
    async function failedCampaignFixture() {
      const { flashFund, owner, creator, donor1, donor2, donor3 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("2") });
      await flashFund.connect(donor2).donate(1, { value: ethers.parseEther("3") });

      await time.increase(31 * 24 * 60 * 60);

      return { flashFund, owner, creator, donor1, donor2, donor3 };
    }

    async function cancelledCampaignFixture() {
      const { flashFund, owner, creator, donor1, donor2, donor3 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("2") });
      await flashFund.connect(donor2).donate(1, { value: ethers.parseEther("3") });
      await flashFund.connect(creator).cancelCampaign(1);

      return { flashFund, owner, creator, donor1, donor2, donor3 };
    }

    it("Should allow refund for failed campaign", async function () {
      const { flashFund, donor1 } = await loadFixture(failedCampaignFixture);

      const donationAmount = ethers.parseEther("2");

      await expect(flashFund.connect(donor1).claimRefund(1))
        .to.emit(flashFund, "RefundProcessed")
        .withArgs(1, donor1.address, donationAmount);

      expect(await flashFund.donations(1, donor1.address)).to.equal(0);
    });

    it("Should allow refund for cancelled campaign", async function () {
      const { flashFund, donor1 } = await loadFixture(cancelledCampaignFixture);

      const donationAmount = ethers.parseEther("2");

      await expect(flashFund.connect(donor1).claimRefund(1))
        .to.emit(flashFund, "RefundProcessed")
        .withArgs(1, donor1.address, donationAmount);
    });

    it("Should revert if no donation found", async function () {
      const { flashFund, donor3 } = await loadFixture(failedCampaignFixture);

      await expect(flashFund.connect(donor3).claimRefund(1))
        .to.be.revertedWith("No donation found");
    });

    it("Should revert for successful campaign", async function () {
      const { flashFund, creator, donor1, donor2 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 5, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("3") });
      await flashFund.connect(donor2).donate(1, { value: ethers.parseEther("3") });
      await time.increase(31 * 24 * 60 * 60);

      await expect(flashFund.connect(donor1).claimRefund(1))
        .to.be.revertedWith("Cannot claim refund");
    });

    it("Should revert for active campaign", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("2") });

      await expect(flashFund.connect(donor1).claimRefund(1))
        .to.be.revertedWith("Cannot claim refund");
    });

    it("Should prevent double refund", async function () {
      const { flashFund, donor1 } = await loadFixture(failedCampaignFixture);

      await flashFund.connect(donor1).claimRefund(1);

      await expect(flashFund.connect(donor1).claimRefund(1))
        .to.be.revertedWith("No donation found");
    });
  });

  describe("Fee Management", function () {
    async function feesAccumulatedFixture() {
      const { flashFund, owner, creator, donor1, donor2, donor3 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("11") });
      await time.increase(31 * 24 * 60 * 60);
      await flashFund.connect(creator).claimFunds(1);

      return { flashFund, owner, creator, donor1, donor2, donor3 };
    }

    it("Should allow owner to withdraw fees", async function () {
      const { flashFund, owner } = await loadFixture(feesAccumulatedFixture);

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await flashFund.connect(owner).withdrawFees();

      expect(await flashFund.accumulatedFees()).to.equal(0);
    });

    it("Should revert if no fees to withdraw", async function () {
      const { flashFund, owner } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(owner).withdrawFees())
        .to.be.revertedWith("No fees to withdraw");
    });

    it("Should revert if not owner tries to withdraw fees", async function () {
      const { flashFund, creator } = await loadFixture(feesAccumulatedFixture);

      await expect(flashFund.connect(creator).withdrawFees())
        .to.be.revertedWithCustomError(flashFund, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to update fee percentage", async function () {
      const { flashFund, owner } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(owner).updateFeePercent(500);
      expect(await flashFund.platformFeePercent()).to.equal(500);
    });

    it("Should revert if fee exceeds maximum", async function () {
      const { flashFund, owner } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(owner).updateFeePercent(1001))
        .to.be.revertedWith("Fee cannot exceed 10%");
    });

    it("Should revert if not owner tries to update fee", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(creator).updateFeePercent(500))
        .to.be.revertedWithCustomError(flashFund, "OwnableUnauthorizedAccount");
    });
  });

  describe("Pause Functionality", function () {
    it("Should allow owner to pause contract", async function () {
      const { flashFund, owner } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(owner).pause();
      expect(await flashFund.paused()).to.equal(true);
    });

    it("Should allow owner to unpause contract", async function () {
      const { flashFund, owner } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(owner).pause();
      await flashFund.connect(owner).unpause();
      expect(await flashFund.paused()).to.equal(false);
    });

    it("Should revert if not owner tries to pause", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(creator).pause())
        .to.be.revertedWithCustomError(flashFund, "OwnableUnauthorizedAccount");
    });

    it("Should revert if not owner tries to unpause", async function () {
      const { flashFund, owner, creator } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(owner).pause();

      await expect(flashFund.connect(creator).unpause())
        .to.be.revertedWithCustomError(flashFund, "OwnableUnauthorizedAccount");
    });
  });

  describe("View Functions", function () {
    it("Should return contract balance", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("2") });

      expect(await flashFund.getContractBalance()).to.equal(ethers.parseEther("2"));
    });

    it("Should return campaign details", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test Title", "Test Desc", "img.jpg", "John", 5, 15);

      const campaign = await flashFund.getCampaign(1);
      expect(campaign.title).to.equal("Test Title");
      expect(campaign.description).to.equal("Test Desc");
      expect(campaign.image).to.equal("img.jpg");
      expect(campaign.author).to.equal("John");
      expect(campaign.goalAmount).to.equal(ethers.parseEther("5"));
      expect(campaign.creator).to.equal(creator.address);
    });

    it("Should revert for non-existent campaign", async function () {
      const { flashFund } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.getCampaign(999))
        .to.be.revertedWith("Campaign does not exist");
    });
  });

  describe("Fallback Functions", function () {
    it("Should revert on direct ETH transfer via receive", async function () {
      const { flashFund, donor1 } = await loadFixture(deployFlashFundFixture);

      await expect(donor1.sendTransaction({
        to: flashFund.target,
        value: ethers.parseEther("1")
      })).to.be.revertedWith("Direct ETH not allowed");
    });

    it("Should revert on invalid function call", async function () {
      const { flashFund, donor1 } = await loadFixture(deployFlashFundFixture);

      await expect(donor1.sendTransaction({
        to: flashFund.target,
        data: "0x12345678"
      })).to.be.revertedWith("Invalid call");
    });
  });

  describe("Reentrancy Protection", function () {
    it("Should prevent reentrancy on donate function", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);

      const ReentrancyAttacker = await ethers.getContractFactory("ReentrancyAttacker");
      const attacker = await ReentrancyAttacker.deploy(flashFund.target);

      await expect(attacker.attack(1, { value: ethers.parseEther("1") }))
        .to.be.revertedWithCustomError(flashFund, "ReentrancyGuardReentrantCall");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle exact minimum donation amount", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);

      await expect(flashFund.connect(donor1).donate(1, { value: ethers.parseEther("0.001") }))
        .to.emit(flashFund, "DonationReceived");
    });

    it("Should handle exact goal amount reached", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 5, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("5") });
      await time.increase(31 * 24 * 60 * 60);

      await expect(flashFund.connect(creator).claimFunds(1))
        .to.emit(flashFund, "FundsClaimed");
    });

    it("Should handle campaign deadline edge case", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 1);

      const campaign = await flashFund.getCampaign(1);
      const deadline = campaign.deadline;

      await time.increaseTo(deadline - 1n);
      await expect(flashFund.connect(donor1).donate(1, { value: ethers.parseEther("1") }))
        .to.emit(flashFund, "DonationReceived");

      await time.increaseTo(deadline + 1n);
      await expect(flashFund.connect(donor1).donate(1, { value: ethers.parseEther("1") }))
        .to.be.revertedWith("Campaign expired");
    });

    it("Should handle maximum fee percentage", async function () {
      const { flashFund, owner, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(owner).updateFeePercent(1000); // 10%
      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("10") });
      await time.increase(31 * 24 * 60 * 60);

      const initialFees = await flashFund.accumulatedFees();
      await flashFund.connect(creator).claimFunds(1);

      const expectedFee = ethers.parseEther("1"); // 10% of 10 ETH
      expect(await flashFund.accumulatedFees()).to.equal(initialFees + expectedFee);
    });

    it("Should handle zero fee percentage", async function () {
      const { flashFund, owner, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(owner).updateFeePercent(0);
      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("10") });
      await time.increase(31 * 24 * 60 * 60);

      await flashFund.connect(creator).claimFunds(1);
      expect(await flashFund.accumulatedFees()).to.equal(0);
    });

    it("Should handle multiple campaigns simultaneously", async function () {
      const { flashFund, creator, donor1, donor2 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Campaign 1", "Desc1", "img1", "Author1", 5, 30);
      await flashFund.connect(creator).createCampaign("Campaign 2", "Desc2", "img2", "Author2", 3, 30);

      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("5") });
      await flashFund.connect(donor2).donate(2, { value: ethers.parseEther("3") });

      await time.increase(31 * 24 * 60 * 60);

      await expect(flashFund.connect(creator).claimFunds(1))
        .to.emit(flashFund, "FundsClaimed");
      await expect(flashFund.connect(creator).claimFunds(2))
        .to.emit(flashFund, "FundsClaimed");
    });

    it("Should handle large donation amounts", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 1000, 30);

      const largeAmount = ethers.parseEther("1000");
      await expect(flashFund.connect(donor1).donate(1, { value: largeAmount }))
        .to.emit(flashFund, "DonationReceived")
        .withArgs(1, donor1.address, largeAmount);
    });

    it("Should handle campaign with minimum duration", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(creator).createCampaign(
        "Test", "Desc", "img", "Author", 1, 1
      )).to.emit(flashFund, "CampaignCreated");
    });

    it("Should handle campaign with maximum duration", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      await expect(flashFund.connect(creator).createCampaign(
        "Test", "Desc", "img", "Author", 1, 365
      )).to.emit(flashFund, "CampaignCreated");
    });
  });

  describe("Gas Optimization Tests", function () {
    it("Should handle batch donations efficiently", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 100, 30);

      for (let i = 0; i < 10; i++) {
        await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("1") });
      }

      expect(await flashFund.donations(1, donor1.address)).to.equal(ethers.parseEther("10"));
    });

    it("Should handle multiple refunds efficiently", async function () {
      const { flashFund, creator, donor1, donor2, donor3 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 100, 30);

      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("1") });
      await flashFund.connect(donor2).donate(1, { value: ethers.parseEther("2") });
      await flashFund.connect(donor3).donate(1, { value: ethers.parseEther("3") });

      await time.increase(31 * 24 * 60 * 60);

      await expect(flashFund.connect(donor1).claimRefund(1))
        .to.emit(flashFund, "RefundProcessed");
      await expect(flashFund.connect(donor2).claimRefund(1))
        .to.emit(flashFund, "RefundProcessed");
      await expect(flashFund.connect(donor3).claimRefund(1))
        .to.emit(flashFund, "RefundProcessed");
    });
  });

  describe("Security Tests", function () {
    it("Should prevent overflow in donation amounts", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 1, 30);

      const maxUint256 = ethers.MaxUint256;
      await expect(flashFund.connect(donor1).donate(1, { value: maxUint256 }))
        .to.be.reverted;
    });

    it("Should handle failed transfer scenarios", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      const RejectEther = await ethers.getContractFactory("RejectEther");
      const rejectContract = await RejectEther.deploy();

      // Test with contract that rejects ether
      await expect(flashFund.connect(rejectContract).createCampaign(
        "Test", "Desc", "img", "Author", 1, 30
      )).to.be.reverted;
    });

    it("Should validate all input parameters strictly", async function () {
      const { flashFund, creator } = await loadFixture(deployFlashFundFixture);

      // Test boundary conditions
      await expect(flashFund.connect(creator).createCampaign(
        "a", "b", "", "", 1, 1
      )).to.emit(flashFund, "CampaignCreated");

      await expect(flashFund.connect(creator).createCampaign(
        "a".repeat(100), "b".repeat(500), "", "", 1, 365
      )).to.emit(flashFund, "CampaignCreated");
    });
  });

  describe("Events Testing", function () {
    it("Should emit all events with correct parameters", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      // Test CampaignCreated event
      await expect(flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 5, 30))
        .to.emit(flashFund, "CampaignCreated")
        .withArgs(1, creator.address);

      // Test DonationReceived event
      const donationAmount = ethers.parseEther("2");
      await expect(flashFund.connect(donor1).donate(1, { value: donationAmount }))
        .to.emit(flashFund, "DonationReceived")
        .withArgs(1, donor1.address, donationAmount);

      // Test CampaignCancelled event
      await expect(flashFund.connect(creator).cancelCampaign(1))
        .to.emit(flashFund, "CampaignCancelled")
        .withArgs(1, creator.address);

      // Test RefundProcessed event
      await expect(flashFund.connect(donor1).claimRefund(1))
        .to.emit(flashFund, "RefundProcessed")
        .withArgs(1, donor1.address, donationAmount);
    });
  });

  describe("State Consistency", function () {
    it("Should maintain consistent state across operations", async function () {
      const { flashFund, creator, donor1, donor2 } = await loadFixture(deployFlashFundFixture);

      // Create campaign
      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 10, 30);
      let campaign = await flashFund.getCampaign(1);
      expect(campaign.isActive).to.equal(true);
      expect(campaign.raisedAmount).to.equal(0);

      // Add donations
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("6") });
      await flashFund.connect(donor2).donate(1, { value: ethers.parseEther("5") });

      campaign = await flashFund.getCampaign(1);
      expect(campaign.raisedAmount).to.equal(ethers.parseEther("11"));

      // Complete campaign
      await time.increase(31 * 24 * 60 * 60);
      await flashFund.connect(creator).claimFunds(1);

      campaign = await flashFund.getCampaign(1);
      expect(campaign.isActive).to.equal(false);
      expect(campaign.fundsClaimed).to.equal(true);
    });

    it("Should handle contract balance correctly", async function () {
      const { flashFund, creator, donor1 } = await loadFixture(deployFlashFundFixture);

      const initialBalance = await flashFund.getContractBalance();
      expect(initialBalance).to.equal(0);

      await flashFund.connect(creator).createCampaign("Test", "Desc", "img", "Author", 5, 30);
      await flashFund.connect(donor1).donate(1, { value: ethers.parseEther("3") });

      expect(await flashFund.getContractBalance()).to.equal(ethers.parseEther("3"));

      await time.increase(31 * 24 * 60 * 60);
      await flashFund.connect(donor1).claimRefund(1);

      expect(await flashFund.getContractBalance()).to.equal(0);
    });
  });
});

// Helper contracts for testing edge cases
const ReentrancyAttackerSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IFlashFund {
    function donate(uint256 _campaignId) external payable;
}

contract ReentrancyAttacker {
    IFlashFund public flashFund;
    uint256 public campaignId;
    
    constructor(address _flashFund) {
        flashFund = IFlashFund(_flashFund);
    }
    
    function attack(uint256 _campaignId) external payable {
        campaignId = _campaignId;
        flashFund.donate{value: msg.value}(_campaignId);
    }
    
    receive() external payable {
        if (address(flashFund).balance >= msg.value) {
            flashFund.donate{value: msg.value}(campaignId);
        }
    }
}
`;

const RejectEtherSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RejectEther {
    receive() external payable {
        revert("Cannot receive ether");
    }
    
    fallback() external payable {
        revert("Cannot receive ether");
    }
}
`;