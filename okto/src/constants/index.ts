import { SupportedChain, SupportedToken } from "../types";

export const addressList = [
  {
    name: "EVM",
    network_name: "BASE",
    imgSrc: "https://avatars.githubusercontent.com/u/108554348?s=280&v=4",
    explorerUrl: "https://basescan.org/address/",
  },
  {
    name: "Polygon",
    network_name: "POLYGON",
    imgSrc:
      "https://i.pinimg.com/originals/9b/1e/97/9b1e977d00b5d887608b156705a10759.png",
    explorerUrl: "https://polygonscan.com/address/",
    txlink: "https://polygonscan.com/tx/",
  },
  {
    name: "Aptos",
    network_name: "APTOS",
    imgSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTKX0VVgxldJmuDo_7lTxhnhqsTXlyTZcARQ&s",
    explorerUrl: "https://explorer.aptoslabs.com/account/",
  },
  {
    name: "Solana",
    network_name: "SOLANA",
    imgSrc: "https://cryptologos.cc/logos/solana-sol-logo.png",
    explorerUrl: "https://explorer.solana.com/address/",
    networkSuffix: "?cluster=mainnet",
  },
  {
    name: "Solana Devnet",
    network_name: "SOLANA_DEVNET",
    imgSrc: "https://cryptologos.cc/logos/solana-sol-logo.png",
    explorerUrl: "https://explorer.solana.com/address/",
    networkSuffix: "?cluster=devnet",
  },
];

export const explorerLinks = [
  {
    name: "Aptos",
    network_name: "APTOS",
    imgSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTKX0VVgxldJmuDo_7lTxhnhqsTXlyTZcARQ&s",
    explorerUrl: "https://explorer.aptoslabs.com/txn/",
    networkSuffix: "?network=mainnet",
  },
  {
    name: "Polygon",
    network_name: "POLYGON",
    imgSrc:
      "https://i.pinimg.com/originals/9b/1e/97/9b1e977d00b5d887608b156705a10759.png",
    explorerUrl: "https://polygonscan.com/tx/",
  },
  {
    name: "Base",
    network_name: "BASE",
    imgSrc:
      "https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png",
    explorerUrl: "https://basescan.org/tx/",
  },
  {
    name: "Osmosis",
    network_name: "OSMOSIS",
    imgSrc: "https://cryptologos.cc/logos/osmosis-osmo-logo.png",
    explorerUrl: "https://www.mintscan.io/osmosis/tx/",
  },
  {
    name: "Solana",
    network_name: "SOLANA",
    imgSrc: "https://cryptologos.cc/logos/solana-sol-logo.png",
    explorerUrl: "https://explorer.solana.com/block/",
    networkSuffix: "?cluster=mainnet",
  },
  {
    name: "Solana Devnet",
    network_name: "SOLANA_DEVNET",
    imgSrc: "https://cryptologos.cc/logos/solana-sol-logo.png",
    explorerUrl: "https://explorer.solana.com/block/",
    networkSuffix: "?cluster=devnet",
  },
  {
    name: "Aptos Testnet",
    network_name: "APTOS_TESTNET",
    imgSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTKX0VVgxldJmuDo_7lTxhnhqsTXlyTZcARQ&s",
    explorerUrl: "https://explorer.aptoslabs.com/tx/",
  },
  {
    name: "Polygon Testnet",
    network_name: "POLYGON_TESTNET_AMOY",
    imgSrc:
      "https://i.pinimg.com/originals/9b/1e/97/9b1e977d00b5d887608b156705a10759.png",
    explorerUrl: "https://amoy.polygonscan.com/tx/",
    networkSuffix: "?network=testnet",
  },
];

export const chainImages: Record<SupportedChain, string> = {
  APTOS: "https://cryptologos.cc/logos/aptos-apt-logo.png",
  APTOS_TESTNET: "https://cryptologos.cc/logos/aptos-apt-logo.png",
  SOLANA: "https://cryptologos.cc/logos/solana-sol-logo.png",
  BASE: "https://avatars.githubusercontent.com/u/108554348?s=280&v=4",
  POLYGON_TESTNET_AMOY: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  SOLANA_DEVNET: "https://cryptologos.cc/logos/solana-sol-logo.png",
  POLYGON: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  OSMOSIS: "https://cryptologos.cc/logos/osmosis-osmo-logo.png",
};

export const tokenImages: Record<SupportedToken, string> = {
  APT: "https://cryptologos.cc/logos/aptos-apt-logo.png",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  MATIC: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  OSMO: "https://cryptologos.cc/logos/osmosis-osmo-logo.png",
  APT_TESTNET: "https://cryptologos.cc/logos/aptos-apt-logo.png",
  SOL_DEVNET: "https://cryptologos.cc/logos/solana-sol-logo.png",
  USDbC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
};
