'use client';
import { useSelector, useDispatch } from 'react-redux';
import { setAddress, setIsHolder, setBalance, setCanSubmitArt } from '../store';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { toast } from 'react-toastify';

const ConnectBtn = () => {
  const dispath = useDispatch();
  const walletAddress = useSelector((state) => state.wallet.address);

  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        const publicKey = response.publicKey.toString();
        dispath(setAddress(publicKey));

        await fetchBalance(publicKey);
      } catch (err) {
        console.error('Connection to wallet failed', err);
      }
    } else {
      alert('Please install the Phantom Wallet extension!');
    }
  };

  const getBalance = async (walletAddress) => {
    try {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_NETWORK);

      // Convert wallet address and token mint address to PublicKey
      const walletPublicKey = new PublicKey(walletAddress);
      const tokenMintPublicKey = new PublicKey(
        process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS
      );

      // Get the associated token account for the wallet and token mint
      const tokenAccountAddress = await getAssociatedTokenAddress(
        tokenMintPublicKey,
        walletPublicKey
      );

      // Fetch token account details
      const tokenAccount = await getAccount(connection, tokenAccountAddress);

      // BigInt balance
      const rawBalance = tokenAccount.amount; // BigInt
      const decimals = 9; // by default

      // Convert BigInt balance to a readable number
      const adjustedBalance = Number(rawBalance) / 10 ** decimals;
      console.log(`Balance: ${adjustedBalance} tokens`);

      return adjustedBalance;
    } catch (error) {
      toast.error(error.message || 'Failed to connect wallet');
    }
  };

  const fetchBalance = async (walletAddress) => {
    const balance = await getBalance(walletAddress);
    dispath(setBalance(balance));
    if (balance > 0) dispath(setIsHolder(true));
    if (balance > process.env.NEXT_PUBLIC_MINIUM_TOKEN_TO_SBMIT)
      dispath(setCanSubmitArt(true));
  };

  return (
    <div>
      {!walletAddress ? (
        <button
          onClick={connectWallet}
          className="p-2 rounded-full bg-primary text-white hover:bg-accent transition-colors duration-200"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="p-2 rounded-full outline outline-2 outline-accent">
          <p className="mt-1 break-all">
            {walletAddress.slice(0, 5) + '...' + walletAddress.slice(38, 42)}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectBtn;
