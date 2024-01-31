require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquierer");
const Busquedas = require("./models/busqueda");

const main = async () => {
    const busquedas = new Busquedas();
    let opt = '';
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // Mostrar Mensaje
                const termino = await leerInput('Cuidad:');
                //Buscar los Lugares
                const lugares = await busquedas.cuidad(termino);
                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id === '0') continue;
                const lugarSel = lugares.find(l => l.id === id);
                busquedas.agregarHistorial(lugarSel.nombre);
                //Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)
                // console.log(clima)
                //Mostrar Resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Cuidad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp)
                console.log('Mínima:',clima.min)
                console.log('Máxima:',clima.max)
                console.log('Clima:',clima.desc)
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                break;
        }
        await pausa()
    } while (opt !== 0);

}

main();