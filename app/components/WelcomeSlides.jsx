"use client"
// components/WelcomeSlides.jsx

import { useState } from 'react';

const slides = [
  {
    id: 1,
    title: 'Welcome to Prompt Website',
    description: 'Prompt could refer to a website or platform designed to help writers generate ideas, prompts, or exercises to inspire creative writing. This website often provide writing prompts, tips, and sometimes communities where writers can share their work or get feedback.',
    imageUrl: '/w1.jpeg',
  },
  {
    id: 2,
    title: 'Discover Amazing Features',
    description: '1.Writing Prompts 2.Prompt Generators like Memes, logos, text ..  3.Community and Sharing 4.Resources and Tips from Experts',
    imageUrl: '/w2.jpeg',
  },
  {
    id: 3,
    title: 'Get Started Today',
    description: 'Start Engaging in Channels to interact with Models',
    imageUrl: '/w3.jpeg',
  },
];

const WelcomeSlides = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  };

  return (
    <div className="relative w-full h-full">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transform transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-full">
            <img
              src={slide.imageUrl}
              alt={`Slide ${slide.id}`}
              className="w-full h-full object-cover object-center"
              style={{ minHeight: '100%', minWidth: '100%' }}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
              <h2 className="text-4xl font-bold">{slide.title}</h2>
              <p className="mt-4 text-lg">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}
      <button className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-xl font-bold" onClick={prevSlide}>
        &#8592;
      </button>
      <button className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-xl font-bold" onClick={nextSlide}>
        &#8594;
      </button>
    </div>
  );
};

export default WelcomeSlides;
