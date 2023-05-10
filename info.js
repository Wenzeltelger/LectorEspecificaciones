const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');
const si = require('systeminformation');
const express = require('express');

const app = express();
const port = 3000;

//const batFilePath = 'ejecutarNode.bat';
const hostname = os.hostname();
const arch = os.arch();
const osType = os.type();
const platform = os.platform();
const cpus = os.cpus();

/*exec(batFilePath, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al ejecutar el archivo .bat: ${error}`);
    return;
  }
  console.log('El archivo .bat se ha ejecutado correctamente.');
  console.log('Salida:', stdout);
});*/

app.get('/', (req, res) => {
  si.diskLayout()
    .then((data) => {
      const ssdList = data.filter((disk) => disk.type === 'SSD');
      if (ssdList.length > 0) {
        console.log('Información del primer SSD:');
        console.log('Modelo:', ssdList[0].name);
        console.log('Tamaño:', ssdList[0].size);
        console.log('Interfaz:', ssdList[0].interfaceType);
        console.log('... Otras propiedades disponibles');

        fs.readFile('index.html', 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
            return;
          }
          const result = data
            .replace('{{hostname}}', hostname)
            .replace('{{arch}}', arch)
            .replace('{{os}}', osType)
            .replace('{{platform}}', platform)
            .replace('{{freemem}}', `${os.freemem() / 1024 / 1024} MB`)
            .replace('{{totalmem}}', `${os.totalmem() / 1024 / 1024} MB`)
            .replace('{{cpu}}', `${cpus[0].model} @ ${cpus[0].speed}MHz (${cpus[0].times.user} user, ${cpus[0].times.sys} sys)`)
            .replace('{{ssdModel}}', ssdList[0].name)
            .replace('{{ssdSize}}', `${(ssdList[0].size / Math.pow(1024, 3)).toFixed(2)} GB`)
            .replace('{{ssdInterface}}', ssdList[0].interfaceType);
          res.send(result);
        });
      } else {
        console.log('No se encontró ningún SSD en el sistema.');
        res.send('No se encontró ningún SSD en el sistema.');
      }
    })
    .catch((error) => {
      console.error('Error al obtener información de los discos duros:', error);
      res.status(500).send('Error interno del servidor');
    });
});

app.listen(port, () => {
  console.log(`Servidor web escuchando en el puerto ${port}`);
});
