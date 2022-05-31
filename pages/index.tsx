import { Web3Provider } from '@ethersproject/providers';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { BigNumber, Contract } from 'ethers';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import {
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";


const Home: NextPage = () => {

  /* All the Variables */
  const zero = BigNumber.from(0);
  const { active, activate, deactivate, connector, library, account, chainId, error } = useWeb3React()
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);
  const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] = useState(
    zero
  );
  const [tokenAmount, setTokenAmount] = useState(zero);
  const [tokensMinted, setTokensMinted] = useState(zero);

  /* Other Functions */
  const getTokensToBeClaimed = async (): Promise<void> => {
    try {
      const provider = await library;

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      )

      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      )
    } catch (err) {
      console.error(err)
    }
  }

  getTokensToBeClaimed()
  /* Wallet Connection */
  const injected = new InjectedConnector({
    supportedChainIds: [5],
  })

  if ( error?.name == "UnsupportedChainIdError" ) {
    alert("Change to Goerli Network")
  }

  const connectWallet = async () => {
    await activate(injected)
    console.log(chainId, 1)
  }



  return (
    <div>
      <Head>
        <title>Crypto Devs ICO</title>
        <meta name="description" content="Initial Coin Offering for Crypto Devs NFT Owners!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className='font-bold text-2xl'>Hello World!</h1>
      {!active ? <button onClick={() => connectWallet()}>Connect Wallet</button> : <span>Connected!</span>}

    </div>
  )
}

export default Home;
