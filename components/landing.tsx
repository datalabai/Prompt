import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import Image from "next/image";

export const Landing = () => {
  return (
    <section className="container grid grid-cols-1 lg:grid-cols-2 place-items-center py-10 md:py-16 lg:py-20 gap-8 lg:gap-10">
      <div className="text-center lg:text-left space-y-4 lg:space-y-6">
        <main className="text-4xl md:text-5xl lg:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#16aad3] to-[#07bc0c] text-transparent bg-clip-text">
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
            <a href="/prompt">Try it out</a>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-[550px] mx-auto lg:mx-0">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <img src="/prompt.gif" alt="Image" className="rounded-md object-cover border" />
        </AspectRatio>
      </div>
    </section>
  );
};
