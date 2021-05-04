const { createWriteStream } = require("fs");
module.exports = function CreateRoute(jack) {
  try {
    const model = createWriteStream(`../routes/${jack}Routes.js`);
    model.write(`
   /**Routes created by utility called jackie
    * ========================================
   */
  const ${jack}Controller = require('../controllers/${jack}Controller');
  const route = require('express').Router();
  route.get('/',${jack}Controller.All);
  route.post('/${jack}', ${jack}Controller.add${jack});
  route.get('/:id', ${jack}Controller.getSingle${jack});
  route.delete('/:id', ${jack}Controller.delete${jack});
  route.put('/:id', ${jack}Controller.update${jack});

 module.exports = route;
  `);
  } catch (ex) {
    console.log("Error occured");
  }
};
