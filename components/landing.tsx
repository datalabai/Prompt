import { Button } from "./ui/button";
import Image from "next/image";

export const Landing = () => {
  return (
    <section className="container grid grid-cols-1 lg:grid-cols-2 place-items-center py-10 md:py-16 lg:py-20 gap-8 lg:gap-10">
      <div className="text-center lg:text-left space-y-4 lg:space-y-6">
        <main className="text-4xl md:text-5xl lg:text-6xl font-bold">
          <h1 className="inline">
            <span>
              PROMPTing
            </span>{" "}
            made fun!
          </h1>
        </main>

        <p className="text-lg md:text-xl text-muted-foreground mx-auto lg:mx-0">
          Prompt.fun unlocks your creativity with the help of prompt experts to generate prompts for you.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-auto">
            <a href="/home">Try it out</a>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-[550px] mx-auto lg:mx-0">
          <img src="/prompt.webp" alt="Image" className="rounded-md object-cover border" />
      </div>
    </section>
  );
};
