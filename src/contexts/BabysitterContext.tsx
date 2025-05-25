import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Babysitter } from '../types';
import { api } from '../services/api'; // Importe o serviço da API

interface BabysitterContextType {
  babysitters: Babysitter[];
  addBabysitter: (babysitter: Omit<Babysitter, 'id'>) => void;
  updateBabysitter: (id: string, babysitter: Omit<Babysitter, 'id'>) => void;
  deleteBabysitter: (id: string) => void;
  getBabysitterById: (id: string) => Babysitter | undefined;
}

const BabysitterContext = createContext<BabysitterContextType | undefined>(undefined);

export const useBabysitter = () => {
  const context = useContext(BabysitterContext);
  if (!context) {
    throw new Error('useBabysitter must be used within a BabysitterProvider');
  }
  return context;
};

interface BabysitterProviderProps {
  children: React.ReactNode;
}

export const BabysitterProvider: React.FC<BabysitterProviderProps> = ({ children }) => {
  const [babysitters, setBabysitters] = useState<Babysitter[]>([]);

  // Carregar crianças do backend
  const fetchBabysitters = async () => {
    const data = await api.getBabysitters();
    setBabysitters(data);
  };

  useEffect(() => {
    fetchBabysitters();
  }, []);

  const addBabysitter = async (babysitter: any) => {
    // Gera um id único se não existir
    const data = babysitter.id ? babysitter : { ...babysitter, id: uuidv4() };
    await api.addBabysitter(data);
    fetchBabysitters();
  };

  const updateBabysitter = async (id: string, babysitterData: Omit<Babysitter, 'id'>) => {
    await api.updateBabysitter(id, babysitterData);
    fetchBabysitters();
  };

  const deleteBabysitter = async (id: string) => {
    await api.deleteBabysitter(id);
    fetchBabysitters();
  };

  const getBabysitterById = (id: string) => babysitters.find(babysitter => babysitter.id === id);

  return (
    <BabysitterContext.Provider value={{
      babysitters,
      addBabysitter,
      updateBabysitter,
      deleteBabysitter,
      getBabysitterById,
      fetchBabysitters,
    }}>
      {children}
    </BabysitterContext.Provider>
  );
};