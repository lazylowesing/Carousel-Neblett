const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("../database/index.js");
const DB_MYSQL = require("../database/sql-index.js")
const middleware = require("./middleware.js");
const helpers = require("./helpers.js");
const faker = require('faker');

const generate = () => {
    const data = {};
    for(i=1; i <= 100000; i++){
        let alt = faker.commerce.productName(); //same as name
        let src = faker.image.avatar();  //also name of obj as string ex: "0"{"alt": "name of product"}
        let category = faker.commerce.product();
        let subCategory = faker.commerce.department();

        data[i] = {
          "alt": alt, 
          "src": src, 
          "id": i, 
          "category": category, 
          "subCategory": subCategory, 
          "name": alt
        }
    }
    return data;
}

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors(middleware.corsOptions));

app.use(express.static("dist"));

app.get("/seedDaDB", (req, res) => {
  
  let data = {};
  let count = 0; 
  let done = false;

  let start = 1;
  let end = 1000;

  const helper = (start, end) => {

    for(productID=start; productID <= end; productID++){
      let alt = faker.commerce.productName(); //same as name
      let src = faker.image.avatar();  //also name of obj as string ex: "0"{"alt": "name of product"}
      let category = faker.commerce.product();
      let subCategory = faker.commerce.department();
      data[productID] = {"alt": alt, "src": src, "id": productID, "category": category, "subCategory": subCategory, "name": alt}
    }
    count ++;  //will get first 1000 items
    if(count === 3){
      done = true;
    }
    while(!done){
      
      //uncomment for query
      DB_MYSQL.insertData = (data)
      data = {};
      helper(start += 1000, end += 1000);
    }
  }

  if(!done){ //runs once
    helper(start, end);
  }
  const items = data;
  res.send(items);

})

// DB_MYSQL.schema();

app.post("/users", middleware.itemLookup, async (req, res) => {
  try {
    const item = req.body.item;
    let sessionId = req.cookies.user_session;
    if (!req.cookies.user_session) {
      sessionId = helpers.randomStringifiedNumberOfLength(32);
      await db.createUser(sessionId);
      res.cookie("user_session", sessionId);
    }
    const user = await db.getUser(sessionId);
    await db.recordView(user.id, item.id);
    res.status(201);
  } catch (err) {
    console.log("duplicate userHist insertion attempted, probably");
  } finally {
    res.send();
  }
});

app.get("/carousels", middleware.itemLookup, async (req, res) => {
  const item = req.body.item;
  const carousels = {};

  carousels.related = await db.selectRelated(item);
  const sameCategory = await db.selectSameCategory(item);
  const alsoViewedFiller = await db.getAlsoViewedFiller(item.id);
  carousels.alsoViewed = helpers.concatOnlyUnique(
    sameCategory,
    alsoViewedFiller
  );
  carousels.prevViewed = await db.getUserHistory(
    req.cookies.user_session,
    item.id
  );

  res.send(carousels);
});

app.listen(PORT, () => {
  console.log(`whats up, i'm on ${PORT}, baby`);
});
