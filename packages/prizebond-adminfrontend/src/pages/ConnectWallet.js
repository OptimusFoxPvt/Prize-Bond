import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MetaMaskIcon from '../components/Icon/MetaMaskIcon';

const ConnectWallet = () => {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  console.log('accountAddress', accountAddress);

  const navigate = useNavigate();

  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      sethaveMetamask(true);
    };
    checkMetamaskAvailability();
  }, []);

  const [token, setToken] = useState('');

  useEffect(() => {
    if (isConnected && token.length !== 0) {
      navigate('/app/dashboard');
    }
  }, [isConnected, navigate, token]);

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      const balance = await provider.getBalance(accounts[0]);
      const bal = ethers.utils.formatEther(balance);
      setAccountAddress(accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);
      // fetch('http://178.62.244.184:3333/api/user/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     metaMaskAddress: accounts[0],
      //   }),
      // })
      //   .then((response) => response.json())
      //   .then((data) => setToken(data?.token))
      //   .catch((error) => console.log(error));

      // { headers: { 'Content-Type': 'application/json' } }
      try {
        const { data } = await axios.post(`http://178.62.244.184:3333/api/user/login`, {
          // metaMaskAddress: accounts[0],
          metaMaskAddress: '0x529Ece8c1995be3D4839912551565F1531037737',
        });
        console.log(data);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        console.log(token);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      setIsConnected(false);
    }
  };

  console.log(token, 'tokennnnnnnn');

  return (
    <div className="login-page">
      <div className="connect-wallet">
        <div>
          <h1>Connect Wallet</h1>
          <p>Connect with your available wallet or create a new wallet to join our platform.</p>
        </div>
        <div className="metamask">
          <MetaMaskIcon />
          <p>Metamask</p>
        </div>
        <button className="connect-wallet-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default ConnectWallet;
