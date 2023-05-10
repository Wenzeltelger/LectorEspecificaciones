const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');
const si = require('systeminformation');

const batFilePath = 'ejecutarNode.bat';
const hostname = os.hostname();
const arch = os.arch();
const osType = os.type();
const platform = os.platform();
const freemem = os.freemem();
const totalmem = os.totalmem();
const cpus = os.cpus();

exec(batFilePath, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al ejecutar el archivo .bat: ${error}`);
    return;
  }
  console.log('El archivo .bat se ha ejecutado correctamente.');
  console.log('Salida:', stdout);
});

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
          return;
        }
        const result = data
          .replace('{{hostname}}', hostname)
          .replace('{{arch}}', arch)
          .replace('{{os}}', osType)
          .replace('{{platform}}', platform)
          .replace('{{freemem}}', `${freemem / 1024 / 1024} MB`)
          .replace('{{totalmem}}', `${totalmem / 1024 / 1024} MB`)
          .replace('{{cpu}}', cpus.map(core => `${core.model} @ ${core.speed}MHz (${core.times.user} user, ${core.times.sys} sys)`).join(', '))
          .replace('{{ssdModel}}', ssdList[0].name)
          .replace('{{ssdSize}}', ssdList[0].size)
          .replace('{{ssdInterface}}', ssdList[0].interfaceType);
        fs.writeFile('output.html', result, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('Archivo generado con éxito');
        });
      });
    } else {
      console.log('No se encontró ningún SSD en el sistema.');
    }
  })
  .catch((error) => {
    console.error('Error al obtener información de los discos duros:', error);
  });
