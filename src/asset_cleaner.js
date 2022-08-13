const path = require('path');
const fs = require('fs');

const buttonEnds = ["1", "2", "3", "4"];
const FOLDERS = ['../assets/common/img/other/', '../assets/mobile/img/other/', '../assets/common/sound/'];
const PATHS_TO_CHECK = ['../build/game.js', '../index.html'];
const EXCLUSIONS = [
    "icon_sound_ambient_off.png",
    "icon_sound_ambient_on.png",
    "icon_sound_effects_off.png",
    "icon_sound_effects_on.png"
];

const removeExtension = function (name) {
    return name.split('.')[0];
}

const checkCanBeButton = function (fileName) {
    let canBeButton = false;
    for (let i = 0; i < buttonEnds.length; i++) {
        if (fileName.endsWith(buttonEnds[i])) {
            canBeButton = true;
        }
    }
    return canBeButton;
}

const checkIsContained = function (fileName) {
    let isContained = false;
    if (checkCanBeButton(fileName)) {
        fileName = fileName.slice(0, -1)
    }
    for (let i = 0; i < PATHS_TO_CHECK.length; i++) {
        const data = fs.readFileSync(PATHS_TO_CHECK[i], 'utf8');
        if (data.includes(fileName)) {
            isContained =  true;
        }
    }
    return isContained;
}

const checkExclusion = function (name) {
    for (let i = 0; i < EXCLUSIONS.length; i++) {
        if (EXCLUSIONS[i] === name) {
            console.log(name + " is excluded");
            return true;
        }
    }
    return false;
}

for (let t = 0; t < FOLDERS.length; t++) {
    const files = fs.readdirSync(FOLDERS[t]);

    const checkedFiles = files.map((name) => {
        return {
            name: name,
            isContained: checkIsContained(removeExtension(name))
        };
    })

    for (let i = 0; i < checkedFiles.length; i++) {
        if (!checkedFiles[i].isContained && !checkExclusion(checkedFiles[i].name)) {
            fs.unlink(FOLDERS[t] + checkedFiles[i].name, function (err) {
                if (err) {
                    throw err
                } else {
                    console.log("Successfully deleted the file: " + checkedFiles[i].name + " from folder: " + FOLDERS[t]);
                }
            })
        }
    }
}


