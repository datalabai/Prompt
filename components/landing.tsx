import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import Image from "next/image"

export const Landing = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#16aad3]  to-[#07bc0c] text-transparent bg-clip-text">
              PROMPTing
            </span>{" "}
            made fun!
          </h1>{" "}
          
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
        Prompt.fun unlocks your creativity with help of prompt experts to generate prompts for you.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3"><a
                            href="/prompt"
                        >Try it out </a></Button>
         
        </div>
      </div>

      
      <div className="z-10 w-[550px]">
      <AspectRatio ratio={16 / 9} className="bg-muted">
  <Image src="/prompt.gif" alt="Image" className="rounded-md object-cover border"  fill/>
  </AspectRatio>
      </div>
      
      <div className="shadow"></div>
    </section>
  );
};