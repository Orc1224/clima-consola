const fs = require('fs');
const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor(){
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map(lugar => {
            let palabras = lugar.split(' '); 
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ')
        })
    }

    get paramsMapBox(){
        return {
            'access-token': process.env.MAPBOX_KEY,
            'language': 'es',
            'limit': 5,
        };
    }

    get paramsWeather(){
        return{
            app: process.env.OPNEWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }
    async cuidad(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?language=es&limit=5&access_token=pk.eyJ1Ijoib3I0MjAiLCJhIjoiY2xzMHJ3YXBzMDFlZTJqcGljbW0yaXRpayJ9.vwBhUC7We3eHQQPVrxV7_Q`,
                // params: this.paramsMapBox
            });
            const resp = await instance.request(instance);
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
        }))

        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon){
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&appid=e5669d6c1899676bb7f628c90be96134`,
                // params: {...this.paramsWeather, lat,lon}
            });
            const resp = await instance.get();
            const {weather, main} = resp.data; // Desdestructuracion
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial(lugar = ''){
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)) return;
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial 
    }
}

module.exports = Busquedas;