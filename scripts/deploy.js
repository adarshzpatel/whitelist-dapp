const {ethers} = require("hardhat");

async function main(){
  const whitelistContract = await ethers.getContractFactory("Whitelist");

  // Passing 10 to set the max number of whitelist addresses allowed
  const deployedWhitelistContract = await whitelistContract.deploy(10);

  //Wait for it to finish deploying 

  await deployedWhitelistContract.deployed();

  //print the addres of the deployed contract
  console.log("Contract deployed Successfully 🚀🚀")
  console.log("COntract Address: " + deployedWhitelistContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });