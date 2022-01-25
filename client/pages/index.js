import Head from 'next/head'
import Web3Modal from "web3modal"
import { providers, Contract } from 'ethers'
import { useEffect, useRef, useState } from 'react';
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";


export default function Home() {
  //Checks if the user has connected wallet or not
  const [walletConnected, setWalletConnected] = useState(false);
  // Checks if the current metamask address has already joined the whitelist or not
  const [joinedWhiteList, setJoinedWhiteList] = useState(false);
  //Loading State
  const [loading, setLoading] = useState(false);
  //Number of whitelisted address
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const web3ModalRef = useRef();


  const getProviderOrSigner = async (needSigner = false) => {
    //Connect to Metamask
    //Since we staore 'web3Modal' as a reference we need to access the current 
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    //If user is not connected to Rinkeby newtwork , let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId != 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby")
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }

  // adding the current connected address to the whitelist
  const addAddressToWhitelist = async () => {
    try {
      //we need a signer here since this is a 'write' transaction
      const signer = await getProviderOrSigner(true);
      //Create a new instance of the contract with a signer, which allowsupdate methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      //wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      //get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhiteList(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numberOfWhitelisted = await whitelistContract.whitelistCount();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  }

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address);
      setJoinedWhiteList(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhiteList) {
        return (
          <div className="text-gray-600  font-bold leading-relaxed">
            Thanks for joining the whitelist 🥳🥳
          </div>
        );
      } else if (loading) {
        return <button className="bg-gradient-to-l hover:hue-rotate-60 shadow hover:shadow-2xl transition-all hover:scale-105 duration-500 ease-out rounded-2xl font-medium text-white text-lg  from-purple-500 to-sky-400 px-6 py-3 my-8 ">Loading ...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className="bg-gradient-to-l hover:hue-rotate-60 shadow hover:shadow-2xl transition-all hover:scale-105 duration-500 ease-out rounded-2xl font-medium text-white text-lg  from-purple-500 to-sky-400 px-6 py-3 my-8 ">
            Connect your wallet
          </button>
        )
      }
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      })
    };
    connectWallet();
  }, [walletConnected]);

  return (
    <div className="">
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='p-8 grid lg:grid-cols-3 gap-8'>
        <div className="shadow-2xl hover:scale-105 duration-500 transition ease-out border border-opacity-50 border-gray-50  backdrop-blur-2xl backdrop-brightness-105 p-8 rounded-xl">
          <h1 className="text-4xl text-gray-800 font-bold leading-snug">Welcome to  <span className='font-extrabold text-sky-400 '>
            Crypto Devs!</span>
          </h1>
          <div className="text-gray-600 italic text-lg font-light">
            Its an NFT collection for developers in Crypto.
          </div>
          {renderButton()}
        </div>
        <div>
          <div className="shadow-2xl hover:scale-105 duration-500 transition ease-out border border-opacity-50 border-gray-50 text-2xl backdrop-blur-2xl backdrop-brightness-105 p-8 rounded-xl">

        <div className='text-6xl font-bold text-gray-800'>
            {numberOfWhitelisted} / 10
        </div>
        <p className='text-lg italic leading-loose text-slate-600'>
            have already joined the Whitelist
        </p>
          </div>
        </div>
      </div>

      <footer className='absolute bottom-0 left-0 flex justify-center p-8 w-full'>
          <div className='backdrop-blur-md border border-gray-50   border-opacity-50  shadow-lg backdrop-brightness-110 px-4 py-2 rounded-lg overflow-hidden'>

          Made with &#10084; by Crypto Devs
        </div>
      </footer>
    </div>
  )
}
