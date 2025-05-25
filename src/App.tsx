import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BabysittersList from './pages/BabysittersList';
import BabysitterForm from './pages/BabysitterForm';
import ShiftsList from './pages/ShiftsList';
import ShiftForm from './pages/ShiftForm';
import Reports from './pages/Reports';
import { BabysitterProvider } from './contexts/BabysitterContext';
import { ShiftProvider } from './contexts/ShiftContext';

function App() {
  return (
    <Router>
      <BabysitterProvider>
        <ShiftProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="babysitters" element={<BabysittersList />} />
              <Route path="babysitters/new" element={<BabysitterForm />} />
              <Route path="babysitters/:id" element={<BabysitterForm />} />
              <Route path="shifts" element={<ShiftsList />} />
              <Route path="shifts/new" element={<ShiftForm />} />
              <Route path="shifts/:id" element={<ShiftForm />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Routes>
        </ShiftProvider>
      </BabysitterProvider>
    </Router>
  );
}

export default App;