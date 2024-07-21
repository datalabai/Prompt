import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, getProfile,transactions } from "@/app/firebase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type ProfileData = {
  address: string;
  createdAt: number;
  displayName: string;
  email: string;
  index: number;
  isAdmin: boolean;
  photo: string;
  uid: string;
};

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactions();
        console.log("Transaction Data");
        console.log(data);
        setTransactionData(data);
      } catch (error) {
        console.error('Error fetching transaction data:', error.message);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setProfileData(data as ProfileData);
        } else {
          console.error('No profile data found');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
      }
    };

    if (!profileData) {
      fetchProfileData();
    }
  }, [profileData]);

  

  const image = auth.currentUser?.photoURL;

  return (
    <ScrollArea className="h-screen">
      <div className="flex min-h-screen w-full flex-col bg-muted/40 pr-4">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="flex sm:col-span-2">
                <Avatar className="m-3 w-24 h-24">
                  <AvatarImage src={image || profileData?.photo || "KS"} />
                  <AvatarFallback>SR</AvatarFallback>
                </Avatar>
                <CardHeader className="ml-0">
                  <CardTitle>{profileData?.displayName || "Loading..."}</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    {profileData?.email || "Loading..."}
                  </CardDescription>
                </CardHeader>
                <CardFooter></CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Balance</CardDescription>
                  <CardTitle className="text-4xl">$1,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">+25% from last week</div>
                </CardContent>
                <CardFooter>
                  <Progress value={25} aria-label="25% increase" />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Rewards</CardDescription>
                  <CardTitle className="text-4xl">$5,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">+10% from last month</div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
            </div>
            <Tabs defaultValue="Transactions">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="Transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="Rewards">Rewards</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="Transactions">
                <Card>
                  <CardHeader className="px-7"></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead className="hidden sm:table-cell">Prompt</TableHead>
                          <TableHead className="hidden sm:table-cell">Type</TableHead>
                          <TableHead className="hidden md:table-cell">Date</TableHead>
                          <TableHead className="hidden md:table-cell">Suggested To</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Add table rows with transaction data here */}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="Rewards">
                <Card>
                  <CardHeader className="px-7"></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead className="hidden sm:table-cell">Prompt</TableHead>
                          <TableHead className="hidden sm:table-cell">Type</TableHead>
                          <TableHead className="hidden md:table-cell">Date</TableHead>
                          <TableHead className="hidden md:table-cell">Suggested To</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Add table rows with transaction data here */}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
