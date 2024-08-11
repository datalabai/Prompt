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
    const handleClickOutside = (event:any) => {
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

  const handleBuyCredits = (amount:any) => {
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
    <ScrollArea className="h-screen">
      <div className="flex min-h-screen w-full flex-col bg-muted/40 pr-4">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
           <Card className="flex flex-col sm:flex-row sm:col-span-2 p-4 shadow-md max-w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto">
  <Avatar className="m-3 w-24 h-24">
    <AvatarImage src={profileData.photo} />
    <AvatarFallback>SR</AvatarFallback>
  </Avatar>
  <CardHeader className="ml-0 flex-1">
    <CardTitle className="text-xl font-bold">{capitalizeWords(profileData.name)}</CardTitle>
    <CardDescription className="text-gray-600 max-w-lg text-balance leading-relaxed">
      {profileData.email}
    </CardDescription>
    <div className="mt-4 flex flex-row items-center">
      <div className="flex items-center ">
        <p className="inline mr-2 text-xs">{profileData.wallet}</p>
        <CopyToClipboard
          text={profileData.wallet}
          onCopy={() => setCopied(true)}
        >
          <button className="ml-2 p-1 border rounded hover:bg-gray-200 flex items-center">
            {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
            <span className="ml-1">{copied ? '' : ''}</span>
          </button>
        </CopyToClipboard>
      </div>
      <div className="relative ml-4">
        <Popover>
          <PopoverTrigger><MdQrCodeScanner /></PopoverTrigger>
          <PopoverContent>
            <div ref={qrRef} className="p-2 bg-white border rounded hover:bg-gray-200 rounded shadow-lg">
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
        </Popover>
      </div>
    </div>
    <Modal></Modal>
  </CardHeader>
  <CardFooter></CardFooter>
</Card>
              <Card>
                <CardHeader>
                  <CardDescription></CardDescription>
                  <CardTitle className="text-xl">Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-7xl">
                    {!profileData.credits ? 0 : profileData.credits}
                  </div>
                </CardContent>
                <CardFooter>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription></CardDescription>
                  <CardTitle className="text-xl">Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-7xl">0</div>
                </CardContent>
                <CardFooter>
                </CardFooter>
              </Card>
            </div>
              <div className="flex items-center">
              </div>
              <Card>
  <CardHeader className="px-7"></CardHeader>
  <CardContent>
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
            <TableHead className="hidden sm:table-cell px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</TableHead>
            <TableHead className="hidden sm:table-cell px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((transaction, index) => (
            <TableRow key={index} className="border-t border-gray-200">
              <TableCell className="px-4 py-2 text-sm font-medium text-gray-900">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {transaction.date}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Transaction Date: {formatTimestamp(transaction.date)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="hidden sm:table-cell px-4 py-2 text-sm font-medium text-gray-900">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {transaction.activity}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{transaction.prompt}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="px-4 py-2 text-sm font-medium text-gray-900">
                {transaction.credits === 0 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {transaction.credits}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You have Free Trials</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span>-</span>
                        {transaction.credits}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Credits Deducted: {transaction.credits}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </CardContent>
</Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}