const path = require('path');
const fs = require('fs');

// Конфигурация
// ключ: в какой файл билдить,
// значение:
//  dirs: из каких дир собирать список ассетов
//  sound: (опционально) если встречаются одинаковые названия файлов mp3 и ogg - какой из них предпочитать
//         Если не указано и одинаковые имена встретились - сборка развалится (нужно будет придумать разные имена)
const config = {
    'assets/desktop.json': {
        dirs: [
            'assets/common/sound',
            'assets/common/img/tiles',
            'assets/common/img/help_lines',
            'assets/common/img/win_effects',
            'assets/common/img/other',
            'assets/desktop/img'
        ],
        sound: 'ogg'
    },
    'assets/mobile.json': {
        dirs: [
            'assets/common/sound',
            'assets/common/img/tiles',
            'assets/common/img/help_lines',
            'assets/common/img/win_effects',
            'assets/common/img/other',
            'assets/common/sound',
            'assets/mobile/img/tiles',
            'assets/mobile/img/help_lines',
            'assets/mobile/img/win_effects',
            'assets/mobile/img/other',
            'assets/mobile/sound'
        ],
        sound: 'mp3'
    }
}

const fileInfo = function (path) {
    const name = path.split( /[\/\\]/ ).pop();
    const base = name.replace(/\.[^\.]+$/, '');
    const ext = name.substr(base.length + 1);
    return { name, base, ext };
}

const fileList = function (directory) {
    try {
        return fs.readdirSync(path.join(__dirname + '/../', directory));
    } catch (err) {
        console.error('WARNING: Unable to read directory [' + directory + ']: ' + err);
        return [];
    }
}

const filesInDirectories = function (directories) {
    let response = {};
    directories.forEach(directory => {
        fileList(directory).forEach( file => {
            const info = fileInfo(file);
            const key = info.base.toLowerCase();
            if (!response.hasOwnProperty(key))
                response[key] = {};
            response[key][info.ext.toLowerCase()] = directory + '/' + file;
        });
    })
    return response;
}

const readyDataError = function (title, c) {
    throw new Error(title + ': ' + JSON.stringify(c, null, 2));
}

const getReadyData = function (files, soundPreferExtension) {
    const data = {
        loader: {},
        images: {},
        sounds: {},
        spritesheets: {}
    }
    for(let key in files) {

        if (files.hasOwnProperty(key)) {
            const c = files[key];
            let extensions = [];
            for (let ext in c) {
                if (c.hasOwnProperty(ext)) {
                    extensions.push(ext);
                }
            }

            const ext = extensions[0];

            if (key.indexOf('loader_') === 0) {
                if (extensions.length !== 1)
                    readyDataError('Картинка для пред загрузки не уникальна', c);

                if (ext !== 'png')
                    readyDataError('Картинка для пред загрузки не png', c);

                data.loader[key] = c[ext];
                continue;
            }

            switch (extensions.length) {
                case 1:
                    switch (ext) {
                        case 'jpg':
                        case 'png':
                            data.images[key] = c[ext];
                            break;
                        case 'mp3':
                        case 'ogg':
                            data.sounds[key] = c[ext];
                            break;
                        case 'json':
                            readyDataError('Spritesheet не верно сконфигурен, идет без картинки с тем же именем', c);
                            break;
                        default:
                            readyDataError('Не поддерживаемый тип ассета', c);
                            break;
                    }
                    break;
                case 2:
                    if (extensions.indexOf('json') + extensions.indexOf('png') === 1) {

                        const json = c['json'];
                        const png = c['png'];

                        if (json.substring(0, json.length-4) !== png.substring(0, png.length-3)) {
                            readyDataError('Spritesheet и картинка в разных дирах - проблема', c);
                        }
                        data.spritesheets[key] = json;

                    } else if (extensions.indexOf('mp3') + extensions.indexOf('ogg') === 1) {

                        if (soundPreferExtension === 'mp3')
                            data.sounds[key] = c['mp3'];
                        else if (soundPreferExtension === 'ogg')
                            data.sounds[key] = c['ogg'];
                        else
                            readyDataError('Звук с одним именем', c);

                    } else {
                        readyDataError('Не уникальные названия файлов', c);
                    }
                    break;
                default:
                    readyDataError('Не уникальные названия файлов', c);
                    break;
            }
        }

    }
    // return data;

    // собираем конечный результат
    let response = [ [], [] ];
    for (let property in data) {
        const responseKey = (property === 'loader') ? 0 : 1;
        if (data.hasOwnProperty(property)) {
            for (let key in data[property]) {
                if (data[property].hasOwnProperty(key)) {
                    response[responseKey].push(data[property][key]);
                }
            }
        }
    }
    return response;
}

const writeFile = function (fileName, content) {
    try {
        fs.writeFileSync(path.join(__dirname + '/../', fileName), content);
        console.log("Файл " + fileName + " - записан")
    } catch (err) {
        console.error("Не удалось записать " + fileName + " - " + err)
    }
}

const main = async function() {

    for (let buildFile in config) {

        if (config.hasOwnProperty(buildFile)) {
            const files = filesInDirectories(config[buildFile].dirs);
            try {
                const data = getReadyData(files, config[buildFile].sound || '');
                writeFile(buildFile, JSON.stringify(data, null, 2));
            } catch (e) {
                console.error("ОШИБКА в сборке [" + buildFile + "]:\n" + e.message);
            }
        }
    }
}

main();

