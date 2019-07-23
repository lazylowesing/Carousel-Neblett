const { Pool } = require("pg");
const CONFIG = require("../config/db.config.json");
const scrapedJSON = require("../scrapedData/scrapings.json");

const pool = new Pool({
  host: CONFIG.host,
  user: CONFIG.user,
  database: CONFIG.database,
  password: CONFIG.password,
  port: CONFIG.port
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const selectAll = async () => {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(`SELECT * FROM images;`);
    return rows;
  } finally {
    client.release()
  }
};

const selectOneById = async (itemId) => {
  const client = await pool.connect()
  const qText = `SELECT * FROM images WHERE id = $1`;
  const qValues = [itemId];
  
  try {
    const { rows } = await client.query(qText, qValues);
    return rows[0];
  } finally {
    client.release();
  }
};

const selectOneByName = async itemName => {
  const client = await pool.connect()
  const qText = `SELECT * FROM images WHERE name = $1`;
  const qValues = [itemName];
  
  try {
    const { rows } = await client.query(qText, qValues);
    return rows[0];
  } finally {
    client.release();
  }
};

const selectRelated = async item => {
  const client = await pool.connect()
  const qText = `SELECT id, name, src, alt FROM images WHERE name != $1 AND category = $2 AND subCategory != $3`;
  const qValues = [item.name, item.category, item.subcategory];
  
  try {
    const { rows } = await client.query(qText, qValues);
    return rows;
  } finally {
    client.release();
  }
};

const selectSameCategory = async item => {
  const client = await pool.connect()
  const qText = `SELECT id, name, src, alt FROM images WHERE name != $1 AND subCategory = $2`;
  const qValues = [item.name, item.subcategory];
  
  try {
    const { rows } = await client.query(qText, qValues);
    return rows;
  } finally {
    client.release();
  }
};

const createUser = async userSesh => {
  const client = await pool.connect()
  const qText = `INSERT INTO users (session) VALUES ($1)`;
  const qValues = [userSesh];
  
  try {
    const result = await client.query(qText, qValues);
    return result;
  } finally {
    client.release();
  }
};

const getUser = async userSesh => {
  const client = await pool.connect()
  const qText = `SELECT * FROM users WHERE session = $1`;
  const qValues = [userSesh];
  
  try {
    const { rows } = await client.query(qText, qValues);
    return rows[0];
  } finally {
    client.release();
  }
};

const recordView = async (userId, itemId) => {
  const client = await pool.connect()
  const qText = `INSERT INTO userHistory (userId, imageId) VALUES ($1, $2)`;
  const qValues = [userId, itemId];
  
  try {
    const result = await client.query(qText, qValues);
    return result;
  } finally {
    client.release();
  }
};

const getUserHistory = async (userSesh, itemId) => {
  const client = await pool.connect()
  const qText = `SELECT images.id, images.name, images.src, images.alt FROM images, userHistory, users 
  WHERE images.id = userHistory.imageId AND users.id = userHistory.userId AND users.session = $1 AND images.id != $2
  ORDER BY userHistory.id DESC;`;
  const qValues = [userSesh, itemId];
  
  try {
    const { rows } = await client.query(qText, qValues);
    return rows;
  } finally {
    client.release();
  }
};

const getAlsoViewedFiller = async itemId => {
  const client = await pool.connect()
  const qText = `SELECT DISTINCT images.id, images.name, images.src, images.alt FROM images, userHistory, users  
  WHERE images.id = userHistory.imageId AND images.id != $1 AND users.id = userHistory.userId AND random() <0.15 limit 15;`;
  const qValues = [itemId];
  
  try {
    const { rows } = await client.query(qText, qValues);
    return rows;
  } finally {
    client.release();
  }
};

const insertScrapings = async scrapings => {
  const qText = `INSERT INTO images (name, src, alt, category, subCategory) VALUES ($1, $2, $3, $4, $5);`;
  
  try {
    for (let i = 1; i < 101; i++) {
      const key = i.toString();
      const current = scrapings[key];
      const qValues = [
        current.name,
        current.src,
        current.alt,
        current.category,
        current.subCategory
      ];
      await pool.query(qText, qValues);
      console.log(current);
    }
  } catch (err) {
    console.log(err);
  }
};

const updateScrapings = async scrapings => {
  const qText = `UPDATE images SET src = $2 WHERE id = $1;`;

  try {
    for (let i = 1; i < 101; i++) {
      const key = i.toString();
      const current = scrapings[key];
      const qValues = [current.id, `https://fec-lowes.s3.us-east-2.amazonaws.com/${current.id}.png`];
      await pool.query(qText, qValues);
      console.log(i);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  selectOneById,
  selectOneByName,
  selectRelated,
  selectSameCategory,
  getAlsoViewedFiller,
  createUser,
  getUser,
  getUserHistory,
  recordView
};

// pool single query method below for likely refactor ---

// const selectAll = async () => {
//   try {
//     const { rows } = await pool.query(`SELECT * FROM images;`);
//     return rows;
//   } catch (err) {
//     console.log(err);
//   }
// };