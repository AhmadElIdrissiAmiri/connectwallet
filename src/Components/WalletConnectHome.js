
import React, { useState, useEffect } from 'react';
import metamask from './Icons/metamask.png';
import phantom from './Icons/phantom.png';
import electrum from './Icons/electrum.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './WalletConnectHome.css';
import { connectPhantom, signMessageWithPhantom } from './Phantom/sol';
import ConnectMetaMask from './MetaMask/eth';
import ConnectElectrum from './Electrum/btc';

function WalletConnectHome() {
    const [provider, setProvider] = useState(null);
    const [publicKey, setpublicKey] = useState(null);
    const [signature, setsignature] = useState(null);
  

    useEffect(() => {
        const getProvider = async () => {
            const provider = await connectPhantom();
            if (provider) {
                setProvider(provider);
             
            }
        };

        getProvider();
    }, []);

    const handleSignMessage = async () => {
        if (provider) {
            await signMessageWithPhantom(provider);
        }
    };
    const getPublicKey = (e) => {

        setpublicKey(e.target.value);
        console.log(publicKey);
    }
    const getSignature = (e) => {

        setsignature(e.target.value);
        console.log(signature)
    }

    return (
        <div className="styleHome">
            <h1 style={{ paddingTop: 70, margin: 0, fontSize: '3em' }}>Welcome to Calico Wallet Connect</h1>
            <h2>Please select the wallet you want to connect</h2>
            <br />
            <br />
            <table className="tableStyle">
                <thead>
                    <tr>
                        <th><img src={metamask} className="walletLogo" alt="MetaMask" /></th>
                        <th><img src={phantom} className="walletLogo" alt="Phantom" /></th>
                        <th><img src={electrum} className="walletLogo" alt="Electrum" /></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><b>MetaMask</b></td>
                        <td><b>Phantom</b></td>
                        <td><b>Electrum</b></td>
                    </tr>
                    <tr>
                        <td><button onClick={ConnectMetaMask} type="button" className="btn btn-primary styleButton">Connect to MetaMask</button></td>
                        <td><button onClick={handleSignMessage} type="button" className="btn btn-primary styleButton">Connect to Phantom</button></td>
                        <td><button onClick={ConnectElectrum} type="button" className="btn btn-primary styleButton">Connect to Electrum</button></td>
                    </tr>
                </tbody>
            </table>
            <br />
          
           {/* Here we have to finish the Manuel Signing part */}
            <h1>Manuel Signing</h1>
            <form>
                <label>Please provide your Public Key: </label> <input onChange={getPublicKey} type='text'  />
                <br />
                <label>Please provide your Signature: </label> <input onChange={getSignature} type='text' />
            </form>
        </div>
    );
}

export default WalletConnectHome;
