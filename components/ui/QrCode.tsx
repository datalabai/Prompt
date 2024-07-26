import React, { useRef, useEffect } from 'react';
import { PublicKey, Keypair, Connection, TransactionSignature } from '@solana/web3.js';
import { encodeURL, createQR, findReference, FindReferenceError } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { Spinner } from './spinner'; // Import the Spinner component
import TickMark from './TickMark'; // Import the TickMark component

interface SimpleQRCodeProps {
  input: string;
  setPaymentStatus: (status: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  paymentStatus: string;
}

const SimpleQRCode: React.FC<SimpleQRCodeProps> = ({ input, setPaymentStatus, setLoading, loading, paymentStatus }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true); // Start loading
        const recipient = new PublicKey('CzKZcazeXoUJr8nksqVivN8ReHZ7Hrof8tdkpguZmDua');
        const amount = new BigNumber(input);
        const reference = new Keypair().publicKey;
        const label = 'Test Store';
        const message = 'Test Store - Order #12';
        const memo = 'TS#12';
        const splToken = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');
        const url = encodeURL({ recipient, amount, reference, label, message, memo, splToken });
        const qrCode = createQR(url);

        if (qrRef.current) {
          qrRef.current.innerHTML = '';
          qrCode.append(qrRef.current);
        }

        // Check for payment confirmation
        const connection = new Connection('https://devnet.helius-rpc.com/?api-key=423d5aa1-fcad-42f7-936f-3f8f318158c4', 'confirmed');
        let signatureInfo;

        const { signature } = await new Promise<{ signature: TransactionSignature }>((resolve, reject) => {
          const interval = setInterval(async () => {
            console.count('Checking for transaction...');
            try {
              signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
              console.log('\n 🖌  Signature found: ', signatureInfo.signature);
              clearInterval(interval);
              resolve(signatureInfo);
            } catch (error: any) {
              if (!(error instanceof FindReferenceError)) {
                console.error(error);
                clearInterval(interval);
                reject(error);
              }
            }
          }, 1000); // Check every second
        });

        if (signature) {
          setPaymentStatus('Payment confirmed');
        }
      } catch (error) {
        console.error(error);
        setPaymentStatus('Payment failed');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    generateQRCode();
  }, [input, setPaymentStatus, setLoading]);

  return (
    <div>
      {loading && <Spinner size="large" />}
      {!loading && paymentStatus === 'Payment confirmed' && <TickMark />}
      <div ref={qrRef} id="qr-code" className="mt-4" style={{ display: loading || paymentStatus === 'Payment confirmed' ? 'none' : 'block' }} />
    </div>
  );
};

export default SimpleQRCode;
