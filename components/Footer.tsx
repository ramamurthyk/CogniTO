
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-textLight p-4 text-center text-label shadow-inner mt-12 md:mt-16">
      <div className="container mx-auto max-w-screen-xl">
        <p>&copy; {new Date().getFullYear()} CogniTO. All rights reserved.</p>
        <p className="mt-2">Strengthening Minds, Enhancing Lives.</p>
      </div>
    </footer>
  );
};

export default Footer;