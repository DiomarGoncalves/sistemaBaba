import express from 'express';
import db from '../sqlite-db.js';

const router = express.Router();

// GET /api/turnos
router.get('/', (req, res) => {
  // Filtro opcional por data: /api/turnos?data=YYYY-MM-DD
  const { data } = req.query;
  let turnos = db.getShifts();
  if (data) turnos = turnos.filter(t => t.date === data);
  res.json(turnos);
});

// GET /api/turnos/:id
router.get('/:id', (req, res) => {
  const turno = db.getShifts().find(t => t.id === req.params.id);
  if (!turno) return res.status(404).json({ error: 'Turno não encontrado' });
  res.json(turno);
});

// POST /api/turnos
router.post('/', (req, res) => {
  try {
    // Log para depuração
    console.log('Recebendo novo turno:', req.body);

    // Checagem de campos obrigatórios
    const requiredFields = [
      'id', 'babysitterId', 'date', 'startTime', 'endTime', 'hoursWorked', 'amount'
    ];
    for (const field of requiredFields) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ''
      ) {
        console.warn(`Campo obrigatório ausente: ${field}`);
        return res.status(400).json({ error: `Campo obrigatório ausente: ${field}` });
      }
    }

    // Checa se a crianças existe antes de inserir
    const babysitter = db.getBabysitters().find(b => b.id === req.body.babysitterId);
    if (!babysitter) {
      console.warn('crianças não encontrada para o ID:', req.body.babysitterId);
      return res.status(400).json({ error: 'crianças não encontrada. Selecione uma crianças válida.' });
    }

    db.addShift(req.body);
    res.status(201).send();
  } catch (err) {
    console.error('Erro ao adicionar turno:', err);
    res.status(500).json({ error: 'Erro ao adicionar turno', details: err.message });
  }
});

// PUT /api/turnos/:id
router.put('/:id', (req, res) => {
  db.updateShift(req.params.id, req.body);
  res.status(204).send();
});

// DELETE /api/turnos/:id
router.delete('/:id', (req, res) => {
  db.deleteShift(req.params.id);
  res.status(204).send();
});

export default router;
