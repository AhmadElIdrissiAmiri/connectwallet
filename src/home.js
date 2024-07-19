// import React, { useState } from 'react';
// import './Home.css';
// import bitcoinIcon from './icons/bitcoin.png';
// import ethereumIcon from './icons/ethereum.png';
// import solanaIcon from './icons/solana.png';
// import electrumIcon from './icons/electrum.png';
// import metamaskIcon from './icons/metamask.png';
// import phantomIcon from './icons/phantom.png';
// import axios from 'axios';

// const Home = () => {
//   const [network, setNetwork] = useState('');
//   const [wallet, setWallet] = useState('');
//   const [hasWallet, setHasWallet] = useState(null);

//   const handleNetworkChange = (selectedNetwork) => {
//     setNetwork(selectedNetwork);
//     setWallet('');
//     setHasWallet(null);
//   };

//   const handleWalletChange = (selectedWallet) => {
//     setWallet(selectedWallet);
//     setHasWallet(null);
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post('/api/connect', { network, wallet });
//       console.log(response.data);
//       if (wallet === 'phantom') {
//         connectPhantom();
//       }
//     } catch (error) {
//       console.error('Error connecting to backend:', error);
//     }
//   };

//   const connectPhantom = async () => {
//     if (window.solana && window.solana.isPhantom) {
//       try {
//         const resp = await window.solana.connect();
//         console.log('Connected with public key:', resp.publicKey.toString());
//         const publicKey = resp.publicKey.toString();

//         // Generate message
//         const messageResponse = await axios.post('/api/generate-message', { publicKey });
//         const message = messageResponse.data.message;

//         // Sign message
//         const encodedMessage = new TextEncoder().encode(message);
//         const signedMessage = await window.solana.request({
//           method: 'signMessage',
//           params: {
//             message: encodedMessage,
//           },
//         });

//         // Verify signature
//         const verifyResponse = await axios.post('/api/verify-signature', {
//           publicKey,
//           message,
//           signature: signedMessage.signature,
//         });

//         if (verifyResponse.data.isValid) {
//           console.log('Signature is valid');
//         } else {
//           console.log('Signature is not valid');
//         }
//       } catch (err) {
//         console.error('Error connecting to Phantom wallet:', err);
//       }
//     } else {
//       console.log('Phantom wallet not installed');
//     }
//   };

//   return (
//     <div className="home-container">
//       <h1>Select Your Network and Wallet</h1>
//       <div className="network-selection">
//         <h2>Select Network</h2>
//         <div className="icons">
//           <img src={bitcoinIcon} alt="Bitcoin" onClick={() => handleNetworkChange('bitcoin')} className={network === 'bitcoin' ? 'selected' : ''} />
//           <img src={ethereumIcon} alt="Ethereum" onClick={() => handleNetworkChange('ethereum')} className={network === 'ethereum' ? 'selected' : ''} />
//           <img src={solanaIcon} alt="Solana" onClick={() => handleNetworkChange('solana')} className={network === 'solana' ? 'selected' : ''} />
//         </div>
//       </div>

//       {network && (
//         <div className="wallet-selection">
//           <h2>Select Wallet</h2>
//           <div className="icons">
//             {network === 'bitcoin' && <img src={electrumIcon} alt="Electrum" onClick={() => handleWalletChange('electrum')} className={wallet === 'electrum' ? 'selected' : ''} />}
//             {network === 'ethereum' && <img src={metamaskIcon} alt="MetaMask" onClick={() => handleWalletChange('metamask')} className={wallet === 'metamask' ? 'selected' : ''} />}
//             {network === 'solana' && <img src={phantomIcon} alt="Phantom" onClick={() => handleWalletChange('phantom')} className={wallet === 'phantom' ? 'selected' : ''} />}
//           </div>
//         </div>
//       )}

//       {wallet && (
//         <div className="wallet-check">
//           <h2>Do you have the {wallet} wallet installed?</h2>
//           <button onClick={() => setHasWallet(true)}>Yes</button>
//           <button onClick={() => setHasWallet(false)}>No</button>
//         </div>
//       )}

//       {hasWallet !== null && (
//         <div className="submit-section">
//           {hasWallet ? (
//             <button onClick={handleSubmit}>Proceed to Connect</button>
//           ) : (
//             <a href={getWalletInstallLink(wallet)} target="_blank" rel="noopener noreferrer">
//               Install {wallet}
//             </a>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const getWalletInstallLink = (wallet) => {
//   switch (wallet) {
//     case 'electrum':
//       return 'https://electrum.org/#download';
//     case 'metamask':
//       return 'https://metamask.io/download.html';
//     case 'phantom':
//       return 'https://phantom.app/download';
//     default:
//       return '#';
//   }
// };

// export default Home;

import React, { useEffect, useState } from 'react';

const Home = () => {
  const [provider, setProvider] = useState(null);
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    const getProvider = () => {
      if ('solana' in window) {
        const anyWindow = window;
        const provider = anyWindow.solana;
        if (provider.isPhantom) {
          return provider;
        }
      }
      window.open('https://phantom.app/', '_blank');
    };

    const provider = getProvider();
    if (provider) {
      provider.connect().then(() => {
        setProvider(provider);
        console.log('Connected to Phantom:', provider.publicKey.toString());
      }).catch(err => {
        console.error('Failed to connect to Phantom:', err);
      });
    }
  }, []);

  const signMessage = async () => {
    if (!provider) return;

    const message = 'To avoid digital dognappers, sign below to authenticate with CryptoCorgis';
    const encodedMessage = new TextEncoder().encode(message);
    try {
      const { signature } = await provider.signMessage(encodedMessage, 'utf8');
      setSignature(signature);
      console.log('Signed message:', signature);

      // Convert signature to base64
      const signatureBase64 = btoa(String.fromCharCode.apply(null, signature));

      const payload = {
        publicKey: provider.publicKey.toString(),
        message,
        signature: signatureBase64,
      };

      console.log('Sending payload to backend:', payload);

      // Send the signed message and public key to the backend for verification
      const response = await fetch('http://localhost:3000/verify-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Verification result:', result);
    } catch (err) {
      console.error('Failed to sign message:', err);
    }
  };

  return (
    <div>
      <button onClick={signMessage}>Sign Message with Phantom</button>
      {signature && <p>Signature: {btoa(String.fromCharCode.apply(null, signature))}</p>}
    </div>
  );
};

export default Home;
