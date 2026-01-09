import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { FinalCTA } from '../components/FinalCTA';
import { SocialProof } from '../components/SocialProof';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <FinalCTA />
    </>
  );
};

export default Home;
