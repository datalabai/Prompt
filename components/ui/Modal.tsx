import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { encodeURL, createQR, FindReferenceError, findReference,validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { ImSpinner2 } from 'react-icons/im'; 
import { updateUserData } from "@/app/firebase";
import { Connection, PublicKey, TransactionSignature,Keypair } from '@solana/web3.js';

export function Modal() {
  const [showQrCode, setShowQrCode] = useState(false);
  const [usdcAmount, setUsdcAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

  const connection = new Connection('https://devnet.helius-rpc.com/?api-key=423d5aa1-fcad-42f7-936f-3f8f318158c4', 'confirmed');

  useEffect(() => {
    if (showQrCode && qrRef.current) {
      try {
        const recipient = new PublicKey('CzKZcazeXoUJr8nksqVivN8ReHZ7Hrof8tdkpguZmDua');
        const amount = new BigNumber(usdcAmount);
        const reference = new Keypair().publicKey;
        const label = 'Test Store';
        const message = 'Test Store - Order #12';
        const memo = 'TS#12';
        const splToken = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');
        const url = encodeURL({ recipient, amount, reference, label, message, memo, splToken });
        const qrCode = createQR(url, 300); // Set QR code size here

        if (qrRef.current) {
          qrRef.current.innerHTML = '';
          qrCode.append(qrRef.current);
        }

        // Start checking for the payment confirmation
        checkPaymentConfirmation(reference);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  }, [showQrCode, usdcAmount]);

  const generateQrCode = () => {
    setShowQrCode(true); // Show QR code
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

   const verifyTx = async(
      recipient: PublicKey,
      amount: BigNumber,
      reference: PublicKey,
      memo: string
  ) =>{
      console.log(`5. Verifying the payment`);
      alert(recipient);
      // Merchant app locates the transaction signature from the unique reference address it provided in the transfer link
      const found = await findReference(connection, reference);
  
      // Merchant app should always validate that the transaction transferred the expected amount to the recipient
      const response = await validateTransfer(
          connection,
          found.signature,
          {
              recipient,
              amount,
              splToken: undefined,
              reference,
              memo
          },
          { commitment: 'confirmed' }
      );
      return response;
  }

  const checkPaymentConfirmation = async (reference: PublicKey) => {
    setLoading(true); // Start loading when checking for payment
    try {
      let signatureInfo;

      const { signature } = await new Promise<{ signature: TransactionSignature }>((resolve, reject) => {
        const interval = setInterval(async () => {
          console.count('Checking for transaction...');
          try {
            signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
            console.log('\n 🖌  Signature found: ', signatureInfo.signature);
            if(qrRef.current)
            {
              qrRef.current.innerHTML = '';
            }
            clearInterval(interval);
            setQrScanned(true); // QR code scanned
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

      await sleep(3000); // Wait for 5 seconds before confirming payment
      if (signature) {
        setPaymentStatus('Payment confirmed');
        setLoading(false); 
        const credits=parseInt(usdcAmount)*10;
        await updateUserData(credits);
        toast.success('Payment confirmed', {
          onClose: () => window.location.reload() // Reload the page or redirect after confirmation
        });
      }

    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Error confirming payment');
      setLoading(false); // Stop loading on error
    }
  };


  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Buy Credits</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{showQrCode ? <p className="flex justify-center">Scan QR code to Pay</p> : "Enter USDC Amount"}</AlertDialogTitle>
        </AlertDialogHeader>
        {showQrCode ? (
          qrScanned ? (
            <div className="flex justify-center items-center h-full">
              {loading ? (
                <div className="flex flex-col items-center">
                  <ImSpinner2 className="animate-spin" size={50} />
                  <p>Processing payment...</p>
                </div>
              ) : (
                <AiOutlineCheckCircle size={350} color="green" />
              )}
            </div>
          ) : (
            <div ref={qrRef} style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }} />
          )
        ) : (
          <>
            <AlertDialogDescription>
              <Input
                placeholder="Enter amount"
                value={usdcAmount}
                onChange={(e) => setUsdcAmount(e.target.value)}
              />
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  generateQrCode();
                }}
              >
                <Button>{loading ? 'Generating...' : 'Continue'}</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
        {qrScanned && paymentStatus && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>{paymentStatus}</div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
