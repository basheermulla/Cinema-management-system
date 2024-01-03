const jFile = require('jsonfile');

const file = 'data/permissions.json'

/*=======================================================================================================
/*=======================//* A Local jsonfile <-:-> data/permissions.json *//*===========================
/*=====================//* Utility functions to read/write data from/to file *//*========================
/*=====================================================================================================*/

// READ File - Get All Permissions
const getPermissionsFile = async () => {
    const result = await jFile.readFile(file);
    return result;
};

// WRITE To File - Write Permissions
const setPermissionsFile = async (data) => {
    await jFile.writeFile(file, data, 'utf8', (err) => {
        if (err) console.error(err);
    });
};

module.exports = {
    getPermissionsFile,
    setPermissionsFile
};