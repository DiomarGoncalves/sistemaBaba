import Database from 'better-sqlite3';
const db = new Database('babycare.db');

// Inicialização das tabelas
db.exec(`
CREATE TABLE IF NOT EXISTS babysitters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hourlyRate REAL NOT NULL,
  isActive INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS shifts (
  id TEXT PRIMARY KEY,
  babysitterId TEXT NOT NULL,
  date TEXT NOT NULL,
  startTime TEXT NOT NULL,
  endTime TEXT NOT NULL,
  notes TEXT,
  isHoliday INTEGER,
  hoursWorked REAL,
  amount REAL,
  FOREIGN KEY (babysitterId) REFERENCES babysitters(id)
);
`);

export default {
  getBabysitters: () => db.prepare('SELECT * FROM babysitters').all(),
  addBabysitter: (b) => db.prepare(
    'INSERT INTO babysitters (id, name, hourlyRate, isActive) VALUES (?, ?, ?, ?)'
  ).run(b.id, b.name, b.hourlyRate, b.isActive ? 1 : 0),
  updateBabysitter: (id, b) => db.prepare(
    'UPDATE babysitters SET name=?, hourlyRate=?, isActive=? WHERE id=?'
  ).run(b.name, b.hourlyRate, b.isActive ? 1 : 0, id),
  deleteBabysitter: (id) => db.prepare('DELETE FROM babysitters WHERE id=?').run(id),

  getShifts: () => db.prepare('SELECT * FROM shifts').all(),
  addShift: (s) => db.prepare(
    `INSERT INTO shifts (id, babysitterId, date, startTime, endTime, notes, isHoliday, hoursWorked, amount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(s.id, s.babysitterId, s.date, s.startTime, s.endTime, s.notes, s.isHoliday ? 1 : 0, s.hoursWorked, s.amount),
  updateShift: (id, s) => db.prepare(
    `UPDATE shifts SET babysitterId=?, date=?, startTime=?, endTime=?, notes=?, isHoliday=?, hoursWorked=?, amount=? WHERE id=?`
  ).run(s.babysitterId, s.date, s.startTime, s.endTime, s.notes, s.isHoliday ? 1 : 0, s.hoursWorked, s.amount, id),
  deleteShift: (id) => db.prepare('DELETE FROM shifts WHERE id=?').run(id),
};
