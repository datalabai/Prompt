import { Button } from "./ui/button";

export const Landing = () => {
  return (
    <div className="text-center grid lg:grid-cols-2 place-items-center lg:gap-24 overflow-y-auto">
      <div>
        <h2 className="text-lg text-primary text-center tracking-wider">
          <img 
            src="/wc1.png" 
            width="500" 
            height="500" 
            className="ml-8" 
          />
        </h2>

        <h2 className="text-3xl md:text-4xl text-center mb-12">
          Design your prompts with help of our experts!
        </h2>

        <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
          <Button className="w-full md:w-auto">
            <a href="/home">Try it out</a>
          </Button>
        </h3>
      </div>

      <div className="w-full max-w-[550px] mx-auto lg:mx-0">
        <img src="/Landing.png" alt="Image" className="rounded-md object-cover border" />
      </div>
    </div>
  );
};