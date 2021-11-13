const { runQuery } = require('../lib/database');

const getByUsername = async username => {
    const sql = 'SELECT id, password, display_name AS displayName, '
        + 'is_active as isActive, is_staff AS isStaff ' +
        'FROM `users` WHERE `username`=?';
    return (await runQuery(sql, [username]))[0];``
};

const create = async (username, password, displayName) => {
    const sql = 'INSERT INTO `users` (username, password, display_name)' +
        ' VALUES (?, ?, ?)';
    await runQuery(sql, [username, password, displayName]);
};

module.exports = { getByUsername, create };