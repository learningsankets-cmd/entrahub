import React from 'react';
import { CircleUserRound } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 fixed top-0 left-0 right-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center text-blue-600 mr-2">
            <CircleUserRound size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            ENTRA<span className="text-blue-600">HUB</span>
          </h1>
        </div>

        <nav>
          <ul className="flex space-x-6 text-sm">
            <li>
              <a 
                href="#help" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Help
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;