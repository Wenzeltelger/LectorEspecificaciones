const fs = require('fs');
const qr = require('qrcode');

// Lee el archivo JSON
fs.readFile('systemInfo.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Crea un código QR a partir del contenido del archivo JSON
  qr.toFile('codigo-qr.png', data, {
    color: {
      dark: '#000000', // Color de los módulos oscuros
      light: '#FFFFFF' // Color de los módulos claros
    }
  }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Código QR generado satisfactoriamente!');
  });
});
