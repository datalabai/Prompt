import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";




export const Landing = () => {
  return (
    <section id="features" className="container py-2 sm:py-4">

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">

        <div >
          <Card className="h-full bg-background border-0 shadow-none">
            <CardHeader className="flex justify-center items-center mb-8">
              <div className=" mb-8">
                <img
                  src="/wc1.png"
                  width="600"
                  height="600"
                  className="-ml-8" />
              </div>

              <h1 className="text-3xl text-center">Design your prompts <br/> with help of our experts!</h1>
            </CardHeader>

            <CardContent className="text-muted-foreground text-center">
            <Button className="w-full md:w-auto">
            <a href="/home">Try it out</a>
          </Button>
            </CardContent>
          </Card>
        </div>
        <div >
          <Card className="h-full bg-background border-0 ">
            <CardHeader className="flex justify-center items-center">
             
                <img
                  src="/landin-final.png"
                  width="700"
                  height="700"
                  className=" " />
              
            </CardHeader>

           
          </Card>
        </div>


      </div>
    </section>
  );
};