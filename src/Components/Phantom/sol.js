import { format } from "date-fns"
export const connectPhantom = async () => {
    if ('solana' in window) {
        const provider = window.solana;
        if (provider.isPhantom) {
            try {
                await provider.connect();
                console.log('Connected to Phantom:', provider.publicKey.toString());
                return provider;
            } catch (err) {
                console.error('Failed to connect to Phantom:', err);
                return null;
            }
        }
    }

};

export const signMessageWithPhantom = async (provider) => {
    const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const message = `I own wallet address ${provider.publicKey.toString()} at time ${now}`;
    const encodedMessage = new TextEncoder().encode(message);
    try {
        const { signature } = await provider.signMessage(encodedMessage, 'utf8');
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
