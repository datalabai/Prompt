
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RightNotifications() {
  return (
    <div className="h-[685px] overflow-y-auto">
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-large">Prompts</CardTitle>
        <CardDescription>
          {/* we can add some tag line for recent prompts */}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
             <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocKFM9tQaWu56LVff7pMGiAp9WmIpAbfO34DdO2zKf1R_wH5SPfM7Q=s96-c" alt="Avatar" />
                <AvatarFallback>KS</AvatarFallback>
              </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Obulapathi N Challa</p>
            <p className="text-sm text-muted-foreground">
            ancient Greek Harp on a windy coast over the sea, vibrant blue, green, red digital painting concept art, --ar 3:5.
            </p>
            <img src="https://storage.googleapis.com/discordbot-5a1b5.appspot.com/1408b81f-fc29-4b81-9242-62309f1545dd.jpg" alt="Image" width={300} height={550} className="mt-4 mb-2 rounded-lg" />
            
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
             <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="https://lh3.googleusercontent.com/a-/ALV-UjUEPKWEO1YuarWyj1Qv_ATrPrmVDITo_KKo2NfVwP7MpFR8Jvx_vd0UJ4EBPqawyYPF9vUARV3qdDM-C3sDT3hqtsCHId-JLS_3AI_oWE-m6B6UDWs97ucsCeHY6MrvsXxq9ZmMlFswG7Fd2KBi0V3z-rIEpksXsLJ3U9Dx_n7_shgzz7c5whAlNLeJ24oe4ROGcd4oyLPsxCPTD6_I48_RWYwk6vNvesK78yf643fT4sUiD_hYrIjSJDqmBjRhDWSa-J43734kbuIbET1j-0uYz2JglJQqwzXlYiTE-qhjA9189MNX-msqRfUx8rnxv36H-V2Ng1x3T9h8DfE2MUP1P7piob6-2B608CPJyPzw3ar40EiJtFwev2N7iXsXUQC_XDzVa_auTIosx0PN5HQ9e1VcrVPDYpYfk9bgSfsIWF58qsfEpj3nCzcuKUW5H0KaMfsulkjeY2fOLfOG-4m0UQKSYS0JKulklct0s3ioZAFIjTpqxEthj-WIblF3UhBz89k0LmgpaFtg9uFvZzh_RfdYN7ZGCCc2VzvX_Q3Pa2-L36El4rYYdgOUUqwfrRW3oGhEtl5qR2dG0XyvJ4JetV3A4TSKy8vx1Gs5vq4ZFT2DjS_H2rrH-9widVbruWwUqi-oj4-aw3mJ_4DyDlmwlaPsYLopqGvF82CID45STKGc-0V55wkWS3pUNztSaLZ6NVpHmBIMiGy4H6SJGsxWfT-zVSXfYt1lBagI4LxLmYL0s4knqXISNNv4zutSz2Zki_DIvBWFfxOmUzLyoPMhFohz63oOZ6X9o-JAuin-FnPbTMOpakNibITrudkex17Wy0KiJ4oQqKCD_BxBuonlv9eJg_Yhk94bIHCCFsIqNWio0is-EFqMDjiQC_mBhffO4Nfs-n5zz0tgovFlgm0hWHyyIGJa_eRX1cP4oZIa_59Dg6EeVErleTZBIntNnN3IVP15Qv4xonmc57NjgKPc3ja3RQ=s96-c" alt="Avatar" />
                <AvatarFallback>KS</AvatarFallback>
              </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Kishore Challapalli</p>
            <p className="text-sm text-muted-foreground">
            a boy mid 20s lying on his armchair in a room where a single light source is a lamp casting shadows from a corner.
            </p>
            <img src="https://storage.googleapis.com/discordbot-5a1b5.appspot.com/9ec001ee-b6d9-40e3-9116-e277eb6e388a.jpg" alt="Image" width={300} height={550} className="mt-4 mb-2 rounded-lg" />
            
          </div>
        </div>
        
      </CardContent>
    </Card>
    </div>
  )
}
