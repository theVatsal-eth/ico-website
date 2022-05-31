import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { injected } from '../utils/connectors'

const getLibrary = (provider?: any) => {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = 15000;
  return library
}

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  ) 
}

export default MyApp
