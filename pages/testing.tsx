import { NextPage } from 'next'
import React from 'react'

const testing: NextPage = () => {
  return (
    <>
        <div>
            <button className='p-3 font-semibold animate-pulse' >Loading..</button>
        </div>

        <div>
            <button className='p-3 bg-yellow-300 rounded-lg font-medium'>
                Withdraw Coins
            </button>
        </div>

        <div className='flex flex-col justify-start items-center'>
          <div className='p-2'>
            <b className='text-blue-700 font-extrabold'>{10 * 10}</b> Tokens can be claimed!
          </div>
          <button className='p-3 bg-blue-400 font-medium rounded-lg'>
            Claim Tokens
          </button>
        </div>



        <div className='flex flex-col justify-start items-center gap-3' >
            <div>
                <input
                    className='border-none outline-none rounded-xl bg-gray-300 p-2 font-medium'
                    type="number"
                    placeholder="Amount of Tokens"
                    // BigNumber.from converts the `e.target.value` to a BigNumber
                    // onChange={(e) => setTokenAmount(BigNumber.from(e.target.value))}
                />
            </div>

            <button
            className='p-3 bg bg-green-500 rounded-lg font-semibold'
            //   disabled={!(tokenAmount > 0)}
            //   onClick={() => mintCryptoDevToken(tokenAmount)}
            >
            Mint Tokens
            </button>
      </div>
    </>
  )
}

export default testing