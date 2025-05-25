import express from 'express';
import db from '../sqlite-db.js';

const router = express.Router();

// GET /api/babas
router.get('/', (req, res) => {
  res.json(db.getBabysitters());
});

// GET /api/babas/:id
router.get('/:id', (req, res) => {
  const babas = db.getBabysitters();
  const baba = babas.find(b => b.id === req.params.id);
  if (!baba) return res.status(404).json({ error: 'crianças não encontrada' });
  res.json(baba);
});

// POST /api/babas
router.post('/', (req, res) => {
  db.addBabysitter(req.body);
  res.status(201).send();
});

// PUT /api/babas/:id
router.put('/:id', (req, res) => {
  db.updateBabysitter(req.params.id, req.body);
  res.status(204).send();
});

// DELETE /api/babas/:id
router.delete('/:id', (req, res) => {
  db.deleteBabysitter(req.params.id);
  res.status(204).send();
});

export default router;
