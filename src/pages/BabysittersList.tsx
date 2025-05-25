import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Users } from 'lucide-react';
import { useBabysitter } from '../contexts/BabysitterContext';
import { useShift } from '../contexts/ShiftContext';
import { toast } from 'react-toastify';

const BabysittersList: React.FC = () => {
  const { babysitters, deleteBabysitter } = useBabysitter();
  const { shifts } = useShift();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    // Check if there are shifts associated with this babysitter
    const hasShifts = shifts.some(shift => shift.babysitterId === id);
    if (hasShifts) {
      toast.error("Cannot delete a babysitter with recorded shifts. Remove the shifts first.");
      return;
    }
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      deleteBabysitter(confirmDeleteId);
      toast.success('Babysitter deleted successfully');
      setConfirmDeleteId(null);
    }
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  const filteredBabysitters = babysitters.filter(babysitter => 
    babysitter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">crianças</h1>
        <Link
          to="/babysitters/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar crianças
        </Link>
      </div>
      
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder="Buscar crianças..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Babysitters list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredBabysitters.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredBabysitters.map((babysitter) => {
              const babysitterShifts = shifts.filter(
                shift => shift.babysitterId === babysitter.id
              );
              
              const totalHours = babysitterShifts.reduce(
                (sum, shift) => sum + shift.hoursWorked, 0
              );
              
              return (
                <li key={babysitter.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                            {babysitter.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {babysitter.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Valor por hora: R${babysitter.hourlyRate.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-sm text-gray-500 mr-6">
                          {babysitterShifts.length} turnos ({totalHours.toFixed(1)} horas)
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/babysitters/${babysitter.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(babysitter.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-4 py-5 sm:p-6 text-center">
            {searchTerm ? (
              <div className="text-gray-500">
                Nenhuma crianças encontrada para "{searchTerm}"
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma crianças cadastrada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece cadastrando uma nova crianças.
                </p>
                <div className="mt-6">
                  <Link
                    to="/babysitters/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar crianças
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Modal de confirmação */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirmar exclusão</h2>
            <p className="mb-6">Tem certeza que deseja excluir esta criança?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BabysittersList;