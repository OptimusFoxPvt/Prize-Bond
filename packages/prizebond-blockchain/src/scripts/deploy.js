const hre = require("hardhat");
async function main() {
  const Pb = await hre.ethers.getContractFactory("PrizeBond");
  const pb = await Pb.deploy();
  await pb.deployed();
  console.log(`Prize Bond Contract Address: "https://testnet.ftmscan.com/address/${pb.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});