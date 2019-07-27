const mysql = require('mysql');
const CONFIG = require("../config/db.config.mysql.json")

console.log('yo dawg, DB here')

const knex = require('knex') (CONFIG);

const imagesSchema = () => {
  knex.schema.createTable('images', (table) => {
    table.integer('id').primary();
    table.string('name');
    table.string('src');
    table.string('alt');
    table.string ('category');
    table.string('subCategory');
  })
  .then(console.log('test'));
};

const usersSchema = () => {
  knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('session', 64).nullable();
  })
  .then(console.log('users schema built into DB!'))
  .catch( error => {console.log('cant build the users schema!\n', error)})
}

const userHistorySchema = () => {
  knex.schema.createTable('userhistory', table => {
    table.increments('id').primary();
    table.integer('userid').nullable();
    table.integer('imageid').nullable();
    // add foreign keys:
    table.foreign('userid').references('users.id');
    table.foreign('imageid').references('images.id');
  })
  .then(console.log('userhistory schema built into DB!'))
  .catch( error => {console.log('cant build the userhistory schema!\n', error)})
}

const insertData = (generated, cb) => {
  // console.log(generated);
  for (let id in generated) {
    const insertion = {
      id          :  Number(id),
      name        : `"${generated[id].name}"`,
      src         : `"${generated[id].src}"` ,
      alt         : `"${generated[id].alt}"` ,
      category    : `"${generated[id].category}"`,
      subCategory : `"${generated[id].subCategory}"`
    }
    knex('images').insert(insertion)
    .then( res => null ) // Need a .then to initiate the knex func
    .catch( err => console.log(err) )
  };
  setTimeout(() => {
    cb(null); //will ony run once after first set is in db
  }, 18000)
};

const selectAll = (cb) => {
  knex.select().from('images')
  .then( result => {
    cb(null, result)
  })
  .catch( error => {
    console.log('knex error: ', error);
    cb(error)
  });
};

const selectOneById = (itemId) => {
  return knex
    .from('images')
    .where({id : itemId})
    .select()
};

const selectOneByName = (itemName, cb) => {
  knex('images')
    .where({
      name : itemName
    })
    .then( result => {
      console.log('knex query result: ', result);
      cb(null, result)
    })
    .catch( error => {
      console.log('knex error: ', error);
      cb(error)
    });
};

const selectRelated = (item, cb) => {
  const qValues = [item.name, item.category, item.subcategory];

  knex('images')
    .whereNot({
      name        : qValues[0],
      subCategory : qValues[2]
    })
    .where({category : qValues[1]})
    .select('id', 'name', 'src', 'alt')
    .then( result => {
      console.log('knex query result: ', result);
      cb(null, result)
    })
    .catch( error => {
      console.log('knex error: ', error);
      cb(error)
    });
};

const selectSameCategory = (item, cb) => {
  const qValues = [item.name, item.subcategory];

  knex('images')
    .whereNot({subCategory : qValues[1]})
    .where({name : qValues[0]})
    .select('id', 'name', 'src', 'alt')
    .then( result => {
      console.log('knex query result: ', result);
      cb(null, result)
    })
    .catch( error => {
      console.log('knex error: ', error);
      cb(error)
    });
};

const createUser = (userSesh, cb) => {
  knex('users').insert({session: userSesh})
  .then( result => {
    console.log('knex query result: ', result);
    cb(null, result)
  })
  .catch( error => {
    console.log('knex error: ', error);
    cb(error)
  });
};

const getUser = (userSesh, cb) => {
  knex('users').where({session : userSesh})
  .then( result => {
    console.log('knex query result: ', result);
    cb(null, result)
  })
  .catch( error => {
    console.log('knex error: ', error);
    cb(error)
  });
};

const recordView = (userId, itemId, cb) => {
  const qText = `INSERT INTO userHistory (userId, imageId) VALUES ($1, $2)`;
  const qValues = [userId, itemId];

  knex('userHistory').insert({
    userId : qValues[0],
    itemId : qValues[1]
  })
  .then( result => {
    console.log('knex query result: ', result);
    cb(null, result)
  })
  .catch( error => {
    console.log('knex error: ', error);
    cb(error)
  });
};

const getUserHistory = (userSesh, itemId, cb) => {
  const qText = `
    SELECT 
      images.id, 
      images.name, 
      images.src, 
      images.alt 
    FROM 
      images, 
      userHistory, 
      users 
    WHERE 
          images.id = userHistory.imageId 
      AND users.id = userHistory.userId 
      AND users.session = $1 
      AND images.id != $2
    ORDER BY 
      userHistory.id DESC;`;

  const qValues = [itemId];

  knex(knex.raw('images, userHistory, users'))
    .orderBy('userHistory.id', 'desc')
    .where({
      'images.id' : userHistory.imagesId,
      'users.id'  : userHistory
    })

}

module.exports = { 
  imagesSchema, 
  usersSchema,
  userHistorySchema,
  insertData,
  selectOneById,
  selectOneByName,
  selectRelated,
  selectSameCategory,
  // getAlsoViewedFiller,
  createUser,
  getUser,
  // getUserHistory,
  // recordViewa 
};