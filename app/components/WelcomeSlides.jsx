import React from 'react';

const LandingPage = () => {
  return (
    <div className="bg-stone-50 h-screen">
      

      {/* Welcome Section */}
      <section className="py-12 bg-stone-50 items-center">
        <div className="container mx-auto px-4 text-center ">
          
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to Prompt</h2>
            <p className="text-gray-700 leading-relaxed">
            This website or platform designed to help writers generate ideas, prompts, or exercises to inspire creative writing. This website often provide writing prompts, tips, and sometimes communities where writers can share their work or get feedback.
            </p>

          {/* <img className="w-1/2" src="/w2.jpeg" alt="Welcome Image" /> */}
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Block 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex">
            <div className="flex-shrink-0 mr-4">
                <img className="w-8 h-8 " src="/easy.png"  />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Less work for you</h2>
              <p className="text-gray-700">Prompt offers simplicity and direct user input handling, it's best suited for basic and immediate user interactions in scenarios where these limitations and considerations are acceptable. </p>
            </div>
          </div>

          {/* Block 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex">
            <div className="flex-shrink-0 mr-4">
            <img className="w-8 h-8 " src="/flexible.png"  />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Super flexible Features</h2>
              <p className="text-gray-700">1.Writing Prompts 2.Prompt Generators like Memes, logos, text ..  3.Community and Sharing 4.Resources and Tips from Experts</p>
            </div>
          </div>

          {/* Block 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex ">
            <div className="flex-shrink-0 mr-4">
            <img className="w-8 h-8 " src="/earn1.png"  />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Earn By Expertise</h2>
              <p className="text-gray-700">To maximize earnings by expertise, consider building a strong online presence, networking within your channel, continuously intracting with users, and suggest high-quality results to users or customers</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-50 text-black py-4 mt">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Prompt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
