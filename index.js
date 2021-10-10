const soundpack = process.argv[2];
const execa = require('execa')
const { join } = require('path')
const fs = require('fs')
let config = require(`./${soundpack}/config.json`);
const defines = config['defines'];

async function extract(key) {
    const startTime = defines[key][0] / 1000;
    const endTime = defines[key][1] / 1000;
    console.log(startTime, endTime);
    const extenstion = config['sound'].split('.')[1];
    const extraction = await execa('ffmpeg', [
        '-ss', startTime,
        '-i', join(process.cwd(), soundpack, config['sound']),
        '-t', endTime,
        '-c', 'copy',
        join(process.cwd(), soundpack, `${key}.${extenstion}`)
    ]);
}

const extenstion = config['sound'].split('.')[1];

for (const key in defines) {
    extract(key);
    config['defines'][key] = `${key}.${extenstion}`;
}

config['key_define_type'] = 'multiple';
let data = JSON.stringify(config);
fs.writeFileSync(join(process.cwd(), soundpack, 'config.json'), data);
console.log(config);