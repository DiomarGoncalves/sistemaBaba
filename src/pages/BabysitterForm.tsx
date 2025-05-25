import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useBabysitter } from '../contexts/BabysitterContext';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const BabysitterForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addBabysitter, updateBabysitter, getBabysitterById } = useBabysitter();
  
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const isEditing = Boolean(id);
  
  useEffect(() => {
    if (isEditing && id) {
      const babysitter = getBabysitterById(id);
      if (babysitter) {
        setName(babysitter.name);
        setHourlyRate(babysitter.hourlyRate.toString());
        setIsActive(babysitter.isActive);
      } else {
        toast.error('Babysitter not found');
        navigate('/babysitters');
      }
    }
  }, [id, isEditing, getBabysitterById, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    if (!hourlyRate.trim() || isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0) {
      toast.error('Please enter a valid hourly rate');
      return;
    }
    
    const babysitterData = {
      name: name.trim(),
      hourlyRate: Number(hourlyRate),
      isActive,
    };
    
    try {
      if (isEditing && id) {
        updateBabysitter(id, babysitterData);
        toast.success('Babysitter updated successfully');
      } else {
        // Gera um id único para nova crianças
        addBabysitter({ ...babysitterData, id: uuidv4() });
        toast.success('Babysitter added successfully');
      }
      navigate('/babysitters');
    } catch (error) {
      toast.error('An error occurred');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <Link
            to="/babysitters"
            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar crianças' : 'Adicionar crianças'}
          </h1>
        </div>
        <button
          type="submit"
          form="babysitter-form"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form id="babysitter-form" onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Digite o nome da crianças"
                  autoComplete="off"
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                Valor por hora (R$)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="hourlyRate"
                  id="hourlyRate"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <div className="flex items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Ativa
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                crianças inativas não aparecerão nos formulários de registro de turno.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BabysitterForm;