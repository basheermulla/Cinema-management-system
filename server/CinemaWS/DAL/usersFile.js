const jFile = require('jsonfile');

const file = 'data/users.json'

/*=======================================================================================================
/*==========================//* A Local jsonfile <-:-> data/users.json *//*==============================
/*=====================//* Utility functions to read/write data from/to file *//*========================
/*=====================================================================================================*/

// READ File - Get All Users
const getUsersFile = async () => {
    const result = await jFile.readFile(file);
    return result;
};

// WRITE To File - Write Users
const setUsersFile = async (data) => {
    await jFile.writeFile(file, data, 'utf8', (err) => {
        if (err) console.error(err);
    });
};

module.exports = {
    getUsersFile,
    setUsersFile
};