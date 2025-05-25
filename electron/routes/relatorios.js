import express from 'express';
import db from '../sqlite-db.js';

const router = express.Router();

// GET /api/relatorios/diario?data=YYYY-MM-DD
router.get('/diario', (req, res) => {
  const { data } = req.query;
  const turnos = db.getShifts().filter(t => t.date === data);
  res.json(turnos);
});

// GET /api/relatorios/semanal?inicio=YYYY-MM-DD&fim=YYYY-MM-DD
router.get('/semanal', (req, res) => {
  const { inicio, fim } = req.query;
  const turnos = db.getShifts().filter(t => t.date >= inicio && t.date <= fim);
  res.json(turnos);
});

// GET /api/relatorios/mensal?mes=YYYY-MM
router.get('/mensal', (req, res) => {
  const { mes } = req.query; // mes = '2025-05'
  const turnos = db.getShifts().filter(t => t.date.startsWith(mes));
  res.json(turnos);
});

// GET /api/relatorios/export/pdf?mes=YYYY-MM
router.get('/export/pdf', (req, res) => {
  // Aqui você pode gerar e enviar o PDF (mock)
  res.type('application/pdf').send('PDF gerado (mock)');
});

// GET /api/relatorios/export/excel?mes=YYYY-MM
router.get('/export/excel', (req, res) => {
  // Aqui você pode gerar e enviar o Excel (mock)
  res.type('application/vnd.ms-excel').send('Excel gerado (mock)');
});

export default router;
