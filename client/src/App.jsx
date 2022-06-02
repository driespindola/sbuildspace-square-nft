import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import myEpicNft from "./utils/MyEpicNFT.json";
import ReactDOM from 'react-dom';


const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "https://testnets.opensea.io/collection/squarenft-fqm4mdsyhi";
const TOTAL_MINT_COUNT = 50;

// I moved the contract address to the top for easy access.
const CONTRACT_ADDRESS = "0x0DdEe49874f23909B452902ac3635B13229AE528";

const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);

            // Setup listener! This is for the case where a user comes to our site
            // and ALREADY had their wallet connected + authorized.
            setupEventListener();
        } else {
            console.log("No authorized account found");
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);

            // Setup listener! This is for the case where a user comes to our site
            // and connected their wallet for the first time.
            setupEventListener();
        } catch (error) {
            console.log(error);
        }
    };

    // Setup our listener.
    const setupEventListener = async () => {
        // Most of this looks the same as our function askContractToMintNft
        try {
            const { ethereum } = window;

            if (ethereum) {
                // Same stuff again
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

                connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
                    console.log(from, tokenId.toNumber());
                    alert(
                        `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
                    );
                });

                console.log("Setup event listener!");
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const askContractToMintNft = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

                console.log("Going to pop wallet now to pay gas...");
                let nftTxn = await connectedContract.makeAnEpicNFT();

                console.log("Mining...please wait.");
                await nftTxn.wait();
                console.log(nftTxn);
                console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const renderNotConnectedContainer = () => (
        <a onClick={connectWallet} className="menu">Connect to Wallet</a>
    );

    const renderMintUI = () => (
        <a onClick={askContractToMintNft} className="menu">
            Mint NFT
        </a>
    );

    const renderAdress = () => (
        <span className="wallet">
          {currentAccount}
        </span>
    );

    const hiddenAdress = () => (
        <span className="hidden-wallet">
          {currentAccount}
        </span>
    );

    return (
        <div className="App">
            <div className="container">
                <div className="main-page">
                  <nav className="navbar">
                      <img id="logo" src="./src/logo.png"></img>
                      <a className="menu" id="menu-abt" href="#about">About</a>
                      <a className="menu" id="menu-col" href="#collection">Collection</a>
                      <span className="menu" id="menu-connect">
                      {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
                      </span>
                    {currentAccount === "" ? hiddenAdress() : renderAdress()}
                  </nav>
                  <div className="home-container">
                    <h1 className="header">Collect this                         Super Rare <br></br> 
                      and Funny NFT</h1>
                    <img id="img-top" className="nft-img" src="./src/nft.png"></img>
                  </div>
                  <button className="btn">
                  <a href={OPENSEA_LINK} target="_blank"> Explore Collection</a>
                  </button>
                </div>
                <div id="about">
                  <h1 className="title">About Us</h1>
                  <div className="about-container">
                    <img className="funny-gif" src="./src/about.gif"></img>
                    <p className="description">
                      Our team believes that web3 is for everyone, regardless of their gender, race, sexual orientation, political orientation, religion, etc.<br></br> We want to use funny images and memes in order to bring diversity to web3! The reason for that is that we believe memes are the thing that unify internet, no one cares about who you are when it comes to memes, there are memes for everyone!
                    </p> 
                    </div>
                </div>
              <div id="collection">
                <h1 className="title">What are the square NFTs?</h1>
                <div className="about-container">
                        <img id="img-bottom" className="img-nft" src="./src/nft.png"></img>
                  <p className="description">
                    SquareNFTs is collection of squares written by randomly generated combination of funny words. You can use as whatever you want! And the randomly generated colors are pretty!
                  </p>
                </div>
              </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                    <a className="footer-text" href={TWITTER_LINK}  rel="noreferrer">{`built on @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;