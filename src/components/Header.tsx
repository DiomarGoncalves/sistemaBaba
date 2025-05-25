import React from 'react';
import { Menu, Clock, Calendar } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 md:hidden"
              onClick={onMenuClick}
            >
              <span className="sr-only">Abrir menu lateral</span>
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:flex items-center space-x-2 text-gray-700">
              <Clock className="h-5 w-5 text-purple-500" />
              <span className="font-medium">{formattedDate}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Calendar className="h-5 w-5 mr-1.5" />
              <span>Hoje</span>
            </button>
            
            <div className="relative">
              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <span className="sr-only">Abrir menu do usuário</span>
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                  A
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;