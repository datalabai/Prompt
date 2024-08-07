
import { Button } from "./ui/button";




export const Services = () => {
  return (
    <section className="container py-24 sm:py-32 items-center">
      <div className="flex items-center">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Prompts{" "}
            </span>
            made fun!
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
          This website or platform designed to help writers generate ideas, prompts, or exercises to inspire creative writing.
          </p>
          <div className="text-muted-foreground text-xl mt-4 mb-8 ">
      <Button className="w-full md:mr-4 md:w-auto"><a 
                  href="/prompt" 
                >Try it out </a></Button>
      </div>
         
        </div>

      <div className="text-muted-foreground text-xl mt-4 mb-8 ">
        <iframe 
                      src="https://player.vimeo.com/video/899262360?h=66049ccc4e&title=0&byline=0&portrait=0&playsinline=0&muted=1&autoplay=1&autopause=0&loop=1&app_id=122963" 
                       className="h-[380px] w-[600px]  object-contain border"
                      
                    />
      </div>
     
      </div>
     
    </section>
  );
};