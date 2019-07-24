const faker = require('faker');

const generate = () => {
    const data = {};
    for(i=1; i <= 100000; i++){
        let alt = faker.commerce.productName(); //same as name
        let src = faker.image.avatar();  //also name of obj as string ex: "0"{"alt": "name of product"}
        let category = faker.commerce.product();
        let subCategory = faker.commerce.department();

        data[`"${i}"`] = {
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

module.exports = { generate };