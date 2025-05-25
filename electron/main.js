import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors'; // Adicione esta linha
import babasRoutes from './routes/babas.js';
import turnosRoutes from './routes/turnos.js';
import relatoriosRoutes from './routes/relatorios.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const api = express();
api.use(cors()); // Adicione esta linha para liberar o CORS
api.use(express.json());
api.use('/api/babas', babasRoutes);
api.use('/api/turnos', turnosRoutes);
api.use('/api/relatorios', relatoriosRoutes);

const SERVER_PORT = 3000;
api.listen(SERVER_PORT, () => {
  console.log(`API local rodando na porta ${SERVER_PORT}`);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
