const path = require('path');
const fs = require('fs');

function pad(number, padLen = 2) {
    return ('000000' + number).substr(-padLen)
}

const addHtmlComment = function(line) {
    return (line.match(/^\s*<!--.+-->\s*$/)) ? line : '<!--' + line + '-->';
}

const removeHtmlComment = function(line) {
    return line.replace(/<!--/, '').replace('-->', '');
}

const changeVersion = function(line) {
    const a = line.match(/\?r(\d+)"/);
    if (a === null)
        return line;

    const origValue = a[0];
    const num = a[1];
    const origDate = num.substr(0, 8);
    const today = new Date();
    const newDate = today.getFullYear() + pad(today.getMonth() + 1,2) + pad(today.getDate(), 2);
    let newNumber = (newDate === origDate) ? parseInt(num.substr(8)) + 1 : 1;
    if (isNaN(newNumber))
        newNumber = 1;

    return line.replace(origValue, '?r' + newDate + pad(newNumber,2) + '"');
}

const getRequest = function() {
    let req = ['prod', false];
    for (let j = 0; j < process.argv.length; j++) {
        if (process.argv[j] === 'dev') {
            req[0] = 'dev';
        }
        if (process.argv[j] === 'up') {
            req[1] = true;
        }
    }
    if (req[0] !== 'prod')
        req[1] = false

    return req;
}

const main = function() {

    const req = getRequest();
    const mode = req[0];
    const up = req[1];

    console.log("MODE: [" + mode +", " + up + "]\n");

    const file = path.join(__dirname + '/../index.html');
    const content = fs.readFileSync(file, 'utf8');

    const lines = content.split("\n");
    let newContent = null;
    for (let i in lines) {
        let line = lines[i];

        if (line.match(/"build\/game\.min\.js/)) {
            line = (mode === 'dev') ? addHtmlComment(line) : removeHtmlComment(line)
            if (up) {
                line = changeVersion(line)
            }
            console.log(":"+ i + " [" + line +"]");
        } else if (line.match(/"build\/game\.js/)) {
            line = (mode !== 'dev') ? addHtmlComment(line) : removeHtmlComment(line)
            console.log(":"+ i + " [" + line +"]");
        }

        if (newContent === null) newContent = line
        else                     newContent += "\n" + line
    }
    fs.writeFileSync(file, newContent);
}

main();

