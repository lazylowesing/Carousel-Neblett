const faker = require('faker');

let count = 0;
let data  = {};
let DB    = [];

let x        = 1
let y        = 10;
let interval = 10;

function resolveAfter2Seconds(start, end) {

  return new Promise(resolve => {
    setTimeout(() => {
      for(i=start; i<=end; i++){
        let alt = faker.commerce.productName(); //same as name
        let src = faker.image.avatar();  //also name of obj as string ex: "0"{"alt": "name of product"}
        let category = faker.commerce.product();
        let subCategory = faker.commerce.department();
        data[i] = {"alt": alt, "src": src, "id": i, "category": category, "subCategory": subCategory, "name": alt}
      }
      // console.log(data);
      resolve(data);
    }, 2000);
  });
}

async function asyncCall(start, end) {

//   console.log(start, end);
console.log(start, end);
  var result = await resolveAfter2Seconds(start, end);
  result;
//   console.log(result);
  const Push = await queryTest(data);
  Push;
  data = {};
  count ++;
//   console.log(count);
  if(count !== 2){
    beg = start + (count * interval);
    end = beg + interval - 1;
    asyncCall(beg, end);
  }
  // expected output: 'resolved'
} 

const queryTest = (data) => { //will have DB in it 
    // console.log(data, "should be coming in chunks");
    DB.push(data);
    console.log(DB, "with count", count);
    DB = [];
    console.log("should empty%%%%%%%%%%", DB);
}

if(count === 0){
  asyncCall(x, y);
}