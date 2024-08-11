"use client";
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth, getProfile } from "../firebase";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useQRCode } from 'next-qrcode';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { MdQrCodeScanner } from "react-icons/md";
import { Modal } from '@/components/ui/Modal';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Timestamp } from "firebase/firestore"; // Add this import if you are using Firebase
import { buttonVariants } from '@/components/ui/button';
import { Linkedin, TwitterIcon, Wallet, XIcon } from 'lucide-react';
import { TwitterLogoIcon } from '@radix-ui/react-icons';
import { TableDemo } from './transactionTable';

type ProfileData = {
  name: string;
  email: string;
  wallet: string;
  photo: string;
  credits: number;
};

type TransactionData = {
  timestamp: Timestamp; // Adjust the type to match the actual data type
  activity: string;
  creditsDeducted: number;
  prompt: string;
};

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const { Canvas } = useQRCode();
  const qrRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfile();
        if (data) {
          console.log(data);
          setProfileData(data.user);
          setTransactionData(data.transactions);
          localStorage.setItem('profileData', JSON.stringify(data.user));
          localStorage.setItem('transactionData', JSON.stringify(data.transactions));
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    const storedProfileData = localStorage.getItem('profileData') || '';
    const storedTransactionData = localStorage.getItem('transactionData') || '';

    if (storedProfileData) {
      const parsedProfileData = JSON.parse(storedProfileData);
      const parsedTransactionData = JSON.parse(storedTransactionData || '[]');
      console.log("Parsed profile data:", parsedProfileData);
      setProfileData(parsedProfileData);
      setTransactionData(parsedTransactionData);

      // Fetch new data to ensure it is up-to-date
      fetchProfileData();
    } else {
      fetchProfileData();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (qrRef.current && !qrRef.current.contains(event.target)) {
        setShowQR(false);
      }
    };

    if (showQR) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQR]);

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatTimestamp = (timestamp: any) => {
    // Convert Firebase Timestamp to JavaScript Date object
    if (timestamp instanceof Timestamp) {
      timestamp = timestamp.toDate();
    } else if (!(timestamp instanceof Date)) {
      timestamp = new Date(timestamp);
    }
    if (isNaN(timestamp.getTime())) {
      return "Invalid Date";
    }

    const date = new Date(timestamp);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = date.getFullYear();
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day}-${year} ${hours}:${minutes}`;
  };

  const sliceTransactionId = (transactionId: string) => {
    return transactionId.slice(0, 5) + '...' + transactionId.slice(-5);
  };

  const handleBuyCredits = (amount: any) => {
    console.log(`Buying ${amount} USDC credits`);
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const rows = transactionData.map((transaction) =>
  ({
    date: formatTimestamp(transaction.timestamp),
    activity: transaction.activity,
    credits: transaction.creditsDeducted,
    prompt: transaction.prompt,
  })
  );

  return (
   
      <section>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          <Card className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center">
            <CardHeader className="mt-8 flex justify-center items-center pb-2">
              <img
                src={profileData.photo}
                alt={capitalizeWords(profileData.name)}
                className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
              />
              <CardTitle className="text-center">{capitalizeWords(profileData.name)}</CardTitle>
              <CardDescription className="text-primary">
                {profileData.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-col break-all text-center pb-2">
              <p >{profileData.wallet}</p>
              <div className="flex ">
                <div className='ml-24 m-2'> <CopyToClipboard
                  text={profileData.wallet}
                  onCopy={() => setCopied(true)}
                >
                  <button>
                    {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
                    <span className="ml-1">{copied ? '' : ''}</span>
                  </button>
                </CopyToClipboard> </div>
                <div className='m-2'> <Popover>
                  <PopoverTrigger><MdQrCodeScanner /></PopoverTrigger>
                  <PopoverContent>
                    <div ref={qrRef} className="text-center ml-8">
                      <Canvas
                        text={profileData.wallet}
                        options={{
                          errorCorrectionLevel: 'M',
                          margin: 3,
                          scale: 12,
                          width: 200,
                          color: {
                            dark: '#000000FF',
                            light: '#FFFFFFFF',
                          },
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>  </div>
              </div>
            </CardContent>
            <Modal></Modal>



            <CardFooter> <div >
              <a
                rel="noreferrer noopener"
                href={profileData.photo}
                target="_blank"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                <span className="sr-only">In icon</span>
                <Linkedin size="20" />
              </a>
            </div>
              <div >
                <a
                  rel="noreferrer noopener"
                  href={profileData.photo}
                  target="_blank"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  <span className="sr-only">X icon</span>
                  <TwitterIcon size={20} />
                </a>
              </div>
            </CardFooter>
          </Card>
          <Card className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center">
            <CardHeader className="mt-8 flex justify-center items-center pb-2">
              <img
                src="/credits.png"
                alt="Credits"
                className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
              />
              <CardTitle className="text-center">Credits</CardTitle>
              <CardDescription className="text-primary">

              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-2">
              <div className="text-7xl">
                {!profileData.credits ? 0 : profileData.credits}
              </div>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
          <Card className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center">
            <CardHeader className="mt-8 flex justify-center items-center pb-2">
              <img
                src="/rewards.png"
                alt="Credits"
                className="absolute -top-12 rounded-full w-24 h-24 bg-blue-200 aspect-square object-cover"
              />

              <CardDescription></CardDescription>
              <CardTitle className="text-center">Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-7xl">0</div>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </div>
        <div className='table-container'>
            
              <Table className='overflow-y'>
              <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Credits</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((profilecredits) => (
            <TableRow key={profilecredits.date}>
              <TableCell className="font-medium">{formatTimestamp(profilecredits.date)}</TableCell>
              <TableCell> <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              {profilecredits.activity}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{profilecredits.prompt}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider></TableCell>
              <TableCell>{profilecredits.credits}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
        </Table>
        
            </div>
         

      </section>

  );
}