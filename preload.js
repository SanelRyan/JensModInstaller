const { ipcRenderer } = require('electron')

ipcRenderer.on('install-reply', (event, arg) => {
  const installbutton = document.getElementById("installbutton");

  installbutton.disabled = false;
  installbutton.value = "Installed!";
  alert("Done!");
})
      

window.addEventListener('DOMContentLoaded', () => {
  const installbutton = document.getElementById("installbutton");
  const ispremium = document.getElementById("ispremium");
    
  installbutton.addEventListener('click', () => {
    installbutton.disabled = true;
    installbutton.value = "Installing...";
    ipcRenderer.send('install', ispremium.checked);
  })
})