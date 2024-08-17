import React, { useState, useEffect } from 'react';
import { useEthereum, useConnect, useAuthCore,  } from '@particle-network/auth-core-modal';
import { KlaytnTestnet } from '@particle-network/chains';
import { ethers } from 'ethers';
import { notification } from 'antd';
import { abi } from "./constants/abi";
import "../src/App.css"
import { contractAddress } from "./constants/address";


const App = () => {
  const { provider, address } = useEthereum();
  const { connect, disconnect } = useConnect();
  const { userInfo } = useAuthCore();

  const customProvider = new ethers.BrowserProvider(provider);
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo, customProvider]);

  const fetchBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    if (!address) {
      console.log("address not initialized yet");
      return;
    }

    const contract = new ethers.Contract(
      contractAddress,
      abi,
      customProvider
    );

    // Read message from smart contract
    const balance = await contract.balanceOf(address);
    console.log(balance);
    setBalance(balance.toString());
  };

  const handleLogin = async (authType) => {
    if (!userInfo) {
      await connect({
          socialType: authType,
          chain: KlaytnTestnet,
      });
    }
  };

  const executeMint = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const signer = await customProvider.getSigner();

    // const contract = new Contract(contractAddress, contractABI, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Send transaction to smart contract to update message
    const tx = await contract.safeMint(address);

    // Wait for transaction to finish
    const receipt = await tx.wait();
    console.log(receipt.hash);
    notification.success({
      message: `https://baobab.klaytnscope.com/txs/${receipt.hash}`
    });
  };

  return (
    <div className="App">
      <div className="logo-header">
        <img src="https://i.ibb.co.com/PcmnFjS/kaia-logo.png" alt="kaia-logo" border="0"  width="120px"/>      
         <h2>W3A Gateway</h2>
      </div>
      {!userInfo ? (
      <div className="login-section">
        <button className="w-4 border-red-900" onClick={() => handleLogin('google')}>
          Sign in with Google
        </button>
        <button className="w-4" onClick={() => handleLogin('twitter')}>
          Sign in with X
        </button>
      </div>
      ) : (
        <div className="profile-card">
          <h2 className='text-white'>{userInfo.name}</h2>
          <div className="balance-section">
           {balance > 0 ? 
            (
              <div className='welcome-section'>
                <h2 >Welcome to W3A Session</h2>
                <button className="sign-message-button" onClick={disconnect}>Disconnect</button>
              </div>
            ) 
            : 
            (
              <div>
              <p>Cannot Enter into W3A Session</p>
              <button className="sign-message-button" onClick={executeMint}>Mint NFT</button>
              <button className="sign-message-button" onClick={disconnect}>Disconnect</button>
              </div>
            )
            
          }
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
