const mysql = require('mysql');
const CONFIG = require("../config/db.config.mysql.json")

const knex = require('knex') ({
  client: 'mysql',
  connection: {
    host     : CONFIG.host,
    user     : CONFIG.user,
    password : CONFIG.password,
    database : CONFIG.database
  }
})

// const connection = mysql.createConnection({
//   host     : CONFIG.host,
//   user     : CONFIG.user,
//   password : CONFIG.password,
//   database : CONFIG.database
// })

const schema = () => {
  knex.schema.createTable('images', (table) => {
    table.integer('id').primary();
    table.string('name');
    table.string('src');
    table.string('alt');
    table.string ('category');
    table.string('subCategrory');
  })
  .then(console.log('test'));
}

const insertData = (generated) => {
  for (let id in generated) {
    console.log(id, generated[id].name)
    // knex('images').insert(
    //   {
    //      id          : `${id}` ,
    //      name        : `"${generated[id].name}"` ,
    //      src         : `"${generated[id].src}"` ,
    //      alt         : `"${generated[id].alt}"` ,
    //      category    : `"${generated[id].category}"`,
    //      subCategory : `"${generated[id].subCategory}"`
    //   }
    // )
  };
}

module.exports = { schema, insertData };