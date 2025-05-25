import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Edit, Trash2, Search, Calendar, Clock } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext';
import { useBabysitter } from '../contexts/BabysitterContext';
import { toast } from 'react-toastify';

const ShiftsList: React.FC = () => {
  const { shifts, deleteShift } = useShift();
  const { getBabysitterById } = useBabysitter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBabysitter, setFilterBabysitter] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      deleteShift(confirmDeleteId);
      toast.success('Turno excluído com sucesso');
      setConfirmDeleteId(null);
    }
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  const filteredShifts = shifts.filter(shift => {
    // Search by babysitter name or notes
    const babysitter = getBabysitterById(shift.babysitterId);
    const searchMatch = !searchTerm || 
      (babysitter && babysitter.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (shift.notes && shift.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by babysitter
    const babysitterMatch = !filterBabysitter || shift.babysitterId === filterBabysitter;
    
    // Filter by date range
    const dateMatch = (!filterStartDate || shift.date >= filterStartDate) && 
                     (!filterEndDate || shift.date <= filterEndDate);
    
    return searchMatch && babysitterMatch && dateMatch;
  });
  
  // Get unique babysitters from shifts
  const uniqueBabysitters = [...new Set(shifts.map(shift => shift.babysitterId))];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Turnos</h1>
        <Link
          to="/shifts/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Registrar Turno
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 shadow sm:rounded-md space-y-4">
        <div className="flex items-center text-sm text-gray-700 mb-2">
          <Filter className="h-4 w-4 mr-2" />
          <span>Filtrar Turnos</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Buscar crianças ou observações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Babysitter filter */}
          <div>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={filterBabysitter}
              onChange={(e) => setFilterBabysitter(e.target.value)}
            >
              <option value="">Todas as crianças</option>
              {uniqueBabysitters.map(id => {
                const babysitter = getBabysitterById(id);
                return babysitter ? (
                  <option key={id} value={id}>
                    {babysitter.name}
                  </option>
                ) : null;
              })}
            </select>
          </div>
          
          {/* Date range */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shifts list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredShifts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredShifts
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((shift) => {
                const babysitter = getBabysitterById(shift.babysitterId);
                
                return (
                  <li key={shift.id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                              {babysitter?.name.charAt(0) || '?'}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {babysitter?.name || 'crianças desconhecida'}
                            </div>
                            <div className="flex items-center mt-1">
                              <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <div className="text-sm text-gray-500">
                                {new Date(shift.date).toLocaleDateString('pt-BR', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-6">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <div className="text-sm text-gray-900">
                              {shift.startTime} - {shift.endTime}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-sm font-medium text-gray-900">
                              {shift.hoursWorked.toFixed(1)} horas
                            </div>
                            <div className="text-sm text-gray-500">
                              R${shift.amount.toFixed(2)}
                            </div>
                          </div>
                          <div className="ml-4 flex space-x-2">
                            <Link
                              to={`/shifts/${shift.id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(shift.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {shift.notes && (
                        <div className="mt-2 ml-14 text-sm text-gray-500 italic">
                          {shift.notes}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        ) : (
          <div className="px-4 py-5 sm:p-6 text-center">
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum turno encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {shifts.length === 0
                  ? "Comece registrando seu primeiro turno."
                  : "Nenhum turno corresponde aos filtros atuais."}
              </p>
              {shifts.length === 0 && (
                <div className="mt-6">
                  <Link
                    to="/shifts/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Turno
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Modal de confirmação */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirmar exclusão</h2>
            <p className="mb-6">Tem certeza que deseja excluir este turno?</p>
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

export default ShiftsList;