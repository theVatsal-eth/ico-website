import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({
    supportedChainIds: [5]
})

export {
    injected
}