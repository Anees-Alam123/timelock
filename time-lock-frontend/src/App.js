import React, { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x58ae780c8115c936c7f83cf7ae405ae89a4fa021";
const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "timeInSeconds", "type": "uint256" }],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
];

function App() {
  const [balance, setBalance] = useState('');
  const [timeInSeconds, setTimeInSeconds] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask is required to interact with this application.");
      return;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getBalance() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const balance = await contract.getBalance();
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error(error);
    }
  }

  async function deposit() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.deposit(timeInSeconds, { value: ethers.parseEther(amount) });
      await tx.wait();
      setMessage('Deposit successful!');
      getBalance();
    } catch (error) {
      console.error(error);
      setMessage('Error during deposit.');
    }
  }

  async function withdraw() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.withdraw();
      await tx.wait();
      setMessage('Withdrawal successful!');
      getBalance();
    } catch (error) {
      console.error(error);
      setMessage('Error during withdrawal.');
    }
  }

  return (
    <div>
      <p class="box">
      <h1>Time Lock</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <button onClick={getBalance}>Get Balance</button>
      <p>Contract Balance: {balance} ETH</p>
      <input
        type="number"
        placeholder="Lock Time (Seconds)"
        value={timeInSeconds}
        onChange={(e) => setTimeInSeconds(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={deposit}>Deposit</button>
      <button onClick={withdraw}>Withdraw</button>
      <p>{message}</p>
      </p>
    </div>
  );
}

export default App;
