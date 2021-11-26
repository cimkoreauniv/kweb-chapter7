const formatDate = date => {
    const yr = date.getFullYear();
    const mon = date.getMonth() + 1;
    const dt = date.getDate();
    const hrs = date.getHours();
    const mins = date.getMinutes();
    const secs = date.getSeconds();
    return `${yr}. ${mon}. ${dt} ${hrs}:${mins}:${secs}`;
};

const replaceDate = article => {
    if (article) {
        article.createdAt = formatDate(article.createdAt);
        article.lastUpdated = formatDate(article.lastUpdated);
    }
    return article;
};

const { runQuery } = require('../lib/database');

const getList = async (start, count) => {
    const sql = 'SELECT articles.id, title, created_at AS createdAt,'
        + ' last_updated AS lastUpdated, users.display_name AS displayName'
        + ' FROM articles INNER JOIN users ON articles.author=users.id'
        + ' WHERE articles.is_active=1 AND articles.is_deleted=0'
        + ' ORDER BY articles.id DESC LIMIT ?, ?';
    ret = await runQuery(sql, [start, count]);
    ret.forEach(replaceDate);
    return ret;
};

const getTotalCount = async () => {
    const sql = 'SELECT Count(*) AS cnt FROM articles WHERE is_active=1 AND is_deleted=0';
    const { cnt } = (await runQuery(sql))[0];
    return cnt;
};

const getById = async id => {
    const sql = 'SELECT articles.id, `title`, content, created_at AS createdAt,'
        + ' last_updated AS lastUpdated, author, users.display_name AS displayName'
        + ' FROM articles INNER JOIN users ON articles.author=users.id'
        + ' WHERE articles.id=? AND articles.is_active=1 AND articles.is_deleted=0';
    return replaceDate((await runQuery(sql, [id]))[0]);
};

const getByIdAndAuthor = async (id, author) => {
    const sql = 'SELECT title, content, author, created_at AS createdAt, last_updated AS lastUpdated'
        + ' FROM articles WHERE id=? AND author=? AND is_active=1 AND is_deleted=0';
    return replaceDate((await runQuery(sql, [id, author.id]))[0]);
};

const create = async (title, content, author) => {
    const sql = 'INSERT INTO articles (title, content, author)'
        + ' VALUES (?, ?, ?)';
    const result = await runQuery(sql, [title, content, author.id]);
    return result.insertId;
};

const update = async (id, title, content) => {
    const sql = 'UPDATE articles SET title=?, content=? WHERE id=?';
    await runQuery(sql, [title, content, id]);
};

const remove = async id => {
    const sql = 'UPDATE articles SET is_deleted=1 WHERE id=?';
    await runQuery(sql, [id]);
};

module.exports = {
    getList, getTotalCount, getById, getByIdAndAuthor, create, update, remove
};
