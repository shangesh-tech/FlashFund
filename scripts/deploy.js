const hre = require("hardhat");

async function main() {
    console.log("Deploying FlashFund contract...");

    const FlashFundCrowdfunding = await hre.ethers.getContractFactory("FlashFund");
    const flashFund = await FlashFundCrowdfunding.deploy();

    await flashFund.waitForDeployment();
    const address = await flashFund.getAddress();

    console.log("FlashFund deployed to:", address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });