const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');
const si = require('systeminformation');
const express = require('express');

const app = express();
const port = 3000;


const hostname = os.hostname();
const arch = os.arch();
const osType = os.type();
const platform = os.platform();
const cpus = os.cpus();

const systemInfo = {};

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

        systemInfo.ssdModel = ssdList[0].name;
        systemInfo.ssdSize = `${(ssdList[0].size / Math.pow(1024, 3)).toFixed(2)} GB`;
        systemInfo.ssdInterfaceType = ssdList[0].interfaceType;
      } else {
        console.log('No se encontró ningún SSD en el sistema.');
      }

      // Agregar otras propiedades al objeto systemInfo
      systemInfo.hostname = hostname;
      systemInfo.arch = arch;
      systemInfo.osType = osType;
      systemInfo.platform = platform;
      systemInfo.freeMem = `${os.freemem() / 1024 / 1024} MB`;
      systemInfo.totalMem = `${os.totalmem() / 1024 / 1024} MB`;
      systemInfo.cpu = `${cpus[0].model} @ ${cpus[0].speed}MHz (${cpus[0].times.user} user, ${cpus[0].times.sys} sys)`;

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
          .replace('{{freemem}}', systemInfo.freeMem)
          .replace('{{totalmem}}', systemInfo.totalMem)
          .replace('{{cpu}}', systemInfo.cpu)
          .replace('{{ssdModel}}', systemInfo.ssdModel || 'No se encontró ningún SSD')
          .replace('{{ssdSize}}', systemInfo.ssdSize || 'N/A')
          .replace('{{ssdInterface}}', systemInfo.ssdInterfaceType || 'N/A');

        fs.writeFile('systemInfo.json', JSON.stringify(systemInfo), (err) => {
          if (err) {
            console.error('Error al escribir en el archivo systemInfo.json:', err);
          }
        });

        res.send(result);
      });
    })
    .catch((error) => {
      console.error('Error al obtener información de los discos duros:', error);
      res.status(500).send('Error interno del servidor');
    });
});

app.listen(port, () => {
  console.log(`Servidor web escuchando en el puerto ${port}`);
});
