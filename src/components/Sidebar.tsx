import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Clock, 
  BarChart2, 
  Settings, 
  X,
  Download
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">BabyCare</span>
            </div>
            <button
              className="md:hidden text-gray-500 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Home className="mr-3 h-5 w-5" />
              Início
            </NavLink>

            <NavLink
              to="/babysitters"
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Users className="mr-3 h-5 w-5" />
              crianças
            </NavLink>

            <NavLink
              to="/shifts"
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Clock className="mr-3 h-5 w-5" />
              Turnos
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <BarChart2 className="mr-3 h-5 w-5" />
              Relatórios
            </NavLink>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Exportar
              </div>
              <button className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                <Download className="mr-3 h-5 w-5" />
                Exportar Dados
              </button>
            </div>
          </nav>

          {/* Settings link */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
              <Settings className="mr-3 h-5 w-5" />
              Configurações
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;