import { Web3Provider } from '@ethersproject/providers';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { BigNumber, Contract, utils } from 'ethers';
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
  const [isOwner, setIsOwner] = useState(false);

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

      const signer = await provider.getSigner(account)
      console.log(signer)

      const address = await signer.getAddress()

      const balance = await nftContract.balanceOf(address)
      
      if (balance === zero) {
        setTokensToBeClaimed(zero)
      } else {
        let amount = 0;

        for (let i = 0; i < balance; i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(address, i)
          const claimed = await tokenContract.tokenIdsClaimed(tokenId)

          if (!claimed) {
            amount ++
          }
        }

        setTokensToBeClaimed(BigNumber.from(amount))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getBalanceOfCryptoDevTokens = async (): Promise<void> => {
    try {
      const provider = library;

      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      )

      const signer = await provider.getSigner(account);
      const address = await signer.getAddress()
      const balance = await tokenContract.balanceOf(address)

      setBalanceOfCryptoDevTokens(balance)

    } catch (err) {
      console.error(err)
      setBalanceOfCryptoDevTokens(zero)
    }
  }

  const mintCryptoDevToken = async (amount: number): Promise<void> => {
    try {
      const signer = await library.getSigner(account)

      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      )

      const value = 0.001 * amount;
      const tx = await tokenContract.mint(amount, { value: utils.parseEther(value.toString()) })

      setLoading(true)

      await tx.wait()
      setLoading(false)

      alert("Successfully minted Crypto Dev Tooken")

      await getBalanceOfCryptoDevTokens()
      await getTotalTokensMinted()
      await getTokensToBeClaimed()

    } catch (err) {
      console.error(err)
    }
  }

  const claimCryptoDevToken = async (): Promise<void> => {
    try {
      
      const signer = await library.getSigner()

      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      )

      const tx = await tokenContract.claim()
      setLoading(true)
      await tx.wait()
      setLoading(false)
      alert("Successfully claimed Crypto Dev Tokens")
      await getBalanceOfCryptoDevTokens()
      await getTotalTokensMinted()
      await getTokensToBeClaimed
    } catch (err) {
      console.error(err)
    }
  }

  const getTotalTokensMinted = async (): Promise<void> => {
    try {
      const provider = library;
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      )

      const _tokensMinted = await tokenContract.totalSupply()
      setTokensMinted(_tokensMinted)
    } catch (err) {
      console.error(err)
    }
  }

  const getOwner = async (): Promise<void> => {
    try {
      const provider = library
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      )

      const _owner = await tokenContract.owner()

      const signer = await library.getSigner()
      const address = await signer.getAddress()
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true)
        console.log("Owner set")
      }
      
    } catch (err) {
      console.error(err)
    }
  }

  const withdrawCoins = async (): Promise<void> => {
    try {
      const signer = await library.getSigner()
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      )

      const tx= await tokenContract.withdraw()
      setLoading(true)
      tx.wait()
      setLoading(false)
      await getOwner()
    } catch (err) {
      console.error(err)
    }
  }

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

  useEffect(() => {
    connectWallet().then(
      () => {
        getTotalTokensMinted()
        getTokensToBeClaimed()
        getBalanceOfCryptoDevTokens()
        withdrawCoins()
      }
    )

  }, [active])

  const renderButton = () => {
    if (loading) {
      return (
        <div>
            <button className='mt-5 font-semibold animate-pulse' >Loading..</button>
        </div>
      )
    }

    if (walletConnected && isOwner) {
      return (
        <div>
            <button className='p-3 bg-yellow-300 rounded-lg font-medium' onClick={() => withdrawCoins()}>
                Withdraw Coins
            </button>
        </div>
      )
    }

    if (tokensToBeClaimed.toNumber() > 0) {
      return (
        <div className='flex flex-col gap-2'>
          <div className='text-xl font-medium'>
            <b className='text-blue-700 font-extrabold'>
              {tokensToBeClaimed.toNumber() * 10}
            </b> Tokens can be claimed!
          </div>
          <button className='p-3 bg-blue-400 font-medium rounded-lg self-start' onClick={() => claimCryptoDevToken()}>
            Claim Tokens
          </button>
        </div>
      )
    }

    return (
      <div className='flex flex-col gap-3' >
            <div>
                <input
                    className='border-none outline-none rounded-xl bg-gray-300 p-2 font-medium'
                    type="number"
                    placeholder="Amount of Tokens"
                    // BigNumber.from converts the `e.target.value` to a BigNumber
                    onChange={(e) => setTokenAmount(BigNumber.from(e.target.value))}
                />
            </div>

            <button
            className='p-3 bg bg-green-500 rounded-lg font-semibold self-start'
            disabled={!(tokenAmount.toNumber() > 0)}
            onClick={() => mintCryptoDevToken(tokenAmount.toNumber())}
            >
            Mint Tokens
            </button>
      </div>
    )

  }

  return (
    <div className='flex flex-col h-screen justify-center items-center gap-10'>
      <Head>
        <title>Crypto Devs ICO</title>
        <meta name="description" content="Initial Coin Offering for Crypto Devs NFT Owners!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex justify-center items-center'> {/* main */}
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold'>Welcom to Crypto Devs <b className='text-blue-600'>ICO</b>!</h1>
          <div className='text-md font-normal'>
            You can claim or mint Crypto Dev tokens here
          </div>
          {active ? (
            <div className='flex flex-col gap-2 mt-2'>
              <div className='text-xl'>
              You have minted <span className='font-bold text-green-700'>{utils.formatEther(balanceOfCryptoDevTokens)}</span> Crypto Dev Tokens
              </div>
              <div className='text-xl'>
                Overall <span className='font-bold text-blue-600'>{utils.formatEther(tokensMinted)}/ 10000</span> have been minted!!!
              </div>
              {renderButton()}
            </div>
          ): (
            <button onClick={() => connectWallet()} className='p-3 bg-blue-400 rounded-lg font-semibold self-start'>
              Connect your wallet
            </button>
          )}
        </div>
        <div>
          <img className='' src='./0.svg'/>
        </div>
      </div>

      <footer className='self-center'>
        Made with &#10084; by Crypto Devs
      </footer>

    </div>
  )
}

export default Home;
