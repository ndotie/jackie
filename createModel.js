const { createWriteStream } = require("fs");
const { jack, attri, ...fields } = require("./jackie.linkage");
function CreateModel(jackie) {
  const model = createWriteStream(`../models/${jackie}.js`);
  model.write(`
     /***    Model file for ${jackie} created by tool jackie by Ndotela
      * ===============================================================*/
  `);
  model.write(`
  const Sequelize = require("sequelize");

//connection
const sequelize = require("./db");//ofcourse this is from sequelize modern way of connecting to db


  const ${jackie} = sequelize.define('${jackie}', {`);

  Object.keys(fields).forEach((item) => {
    let kids = Object.keys(fields[item]);
    model.write(`${item} : {`);
    kids.forEach((kid) => {
      model.write(`${kid} : ${fields[item][kid]},`);
    });

    model.write(`},`);
  });
  model.write(`
});
  `);

  model.write(`
  module.exports = ${jackie}
  `);
}

module.exports = CreateModel;
