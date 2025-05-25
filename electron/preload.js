import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getBabysitters: () => ipcRenderer.invoke('get-babysitters'),
  addBabysitter: (babysitter) => ipcRenderer.invoke('add-babysitter', babysitter),
  updateBabysitter: (id, data) => ipcRenderer.invoke('update-babysitter', id, data),
  deleteBabysitter: (id) => ipcRenderer.invoke('delete-babysitter', id),

  getShifts: () => ipcRenderer.invoke('get-shifts'),
  addShift: (shift) => ipcRenderer.invoke('add-shift', shift),
  updateShift: (id, data) => ipcRenderer.invoke('update-shift', id, data),
  deleteShift: (id) => ipcRenderer.invoke('delete-shift', id),
});
