const { createWriteStream } = require("fs");
const jackData = require("./jackie.linkage");
const deleteThru = Object.keys(jackData.attri).filter((item) =>
  item.match("delete_")
);
const getThru = Object.keys(jackData.attri).filter((item) =>
  item.match("get_")
);
const updateThru = Object.keys(jackData.attri).filter((item) =>
  item.match("update_")
);

function CreateController(jack) {
  const controller = createWriteStream(`../controllers/${jack}Controller.js`);
  controller.write(`
  /**controller for ${jack}Model written by utility called jackie: by Ndotela
   * ============================================================
  */
 const ${jack}Model = require('../models/${jack}');
//  const routes = require('express').Route();
 exports.All = async (req,res) => {
   //reuesting for all resources from the database
   try {
       const resources = await ${jack}Model.findAll();
       if(resources && resources.length) {
         res.json({
           success : true,
           message : '${jack} retrieved successfully',
           contents : resources 
         })
       }else {
         res.json({
           success : true,
           message : '${jack} had no data not retrieve',
           contents : []
         })
       }
   }catch(ex) {
     //ex
     res.json({
       success : false,
       message : 'Sorry an error had just occured',
       contents : []
     })
   }
 }
  `);

  //Getting a single resources
  controller.write(`
/****
 * when we're trying to get a single record from the
 * data base using an id
 * ===========================================*/
exports.getSingle${jack} = async (req,res) => {
  try{
        const {id} = req.params;
        const rep = await ${jack}Model.findOne({where : {id}});
        if(rep ) {
          res.json({success : true, contents : rep })
        }else {
          res.json({success : false, contents : {}})
        }
  }catch(ex){
    //ex
    res.json({success : false , contents : {}, message : ex.name})
  }
}
`);
  //get Thru attribute
  jackData.attri[getThru[0]]?.forEach((thru) => {
    controller.write(`
    /****
 * when we're trying to get a single record from the
 * data base using an ${thru}
 * ===========================================*/
exports.getSingle${jack}Thru_${thru} = async  (req,res) => {
  try{
        const {${thru}} = req.params;
        const rep = await ${jack}Model.findOne({where : {${thru}}});
        if(rep ) {
          res.json({success : true, content : rep})
        }else {
          res.json({success : false, content : {}})
        }
  }catch(ex){
    //ex
    res.json({success : false , content : {}, message : ex.name})
  }
}
   /****
 * when we're trying to get all records from the
 * data base using an ${thru} as key
 * ===========================================*/
exports.getAll${jack}Thru_${thru} = async (req,res) => {
  try{
        const {${thru}} = req.params;
        const rep = await ${jack}Model.findAll({where : {${thru}}});
        if(rep ) {
          res.json({success : true, content : rep })
        }else {
          res.json({success : false, content : []})
        }
  }catch(ex){
    //ex
    res.json({success : false , content : [], message : ex.name})
  }
}

`);
  });

  //get Thru attribute
  jackData.attri[deleteThru[0]]?.forEach((thru) => {
    controller.write(`
    /****
 * when we're trying to delete a single record from the
 * data base using an ${thru}
 * ===========================================*/
exports.delete${jack}Thru_${thru} = async (req,res) => {
  try{
        const {${thru}} = req.params;
        const rep = await ${jack}Model.destroy({where : {${thru}}});
        res.json({success : true, message : '${jack} with ' + ${thru} +' is successful deleted'})
  }catch(ex){
    //ex
    res.json({success : false , message : ex.name})
  }
}`);
  });
  //Creating a post for a data
  controller.write(`
/** Receive posted data thru http post
 * ========================================================**/
exports.add${jack} = async (req,res) => {
  try {
      const new${jack} = await ${jack}Model.create(req.body);
      res.json({success : true , new${jack}});//just for now to see how we're going with it right now
  }catch(ex) {
    //ex
    res.json({success : false,message :  ex.name})
  }
}
`);

  //Delete a post of data from the database
  controller.write(`
/**
 * Deleting a ${jack} record from a database
 * ========================================================**/
exports.delete${jack} = async (req,res) => {
  try {
     const {id} = req.params
     await ${jack}Model.destroy({
       where : { id }
     })
     res.json({success : true, message :  '${jack} record deleted successfully,'})
  }catch(ex) {
    //ex
    res.json({success : false, message :    '${jack} delete failed, due to ' + ex.name})
  }
}
`);

  //Updating a post of data from the database
  controller.write(`
 /**
  * updating a post of data using a put lets say and an id provided
  * ===============================================================**/
 exports.update${jack} = async (req,res) => {
   try {
       const {id} = req.params
       await ${jack}Model.update(
       req.body,
        { where : {id}}
       )
       res.json({success : true, message : '${jack} record updated successfully'})
   }catch(ex) {
     res.json({success : false, message : ex.name})
   }
 }

`);

  //updating for many
  jackData.attri[updateThru[0]]?.forEach((thru) => {
    controller.write(`
    /****
 * when we're trying to update a single record from the
 * data base using an ${thru}
 * ===========================================*/
exports.update${jack}Thru_${thru} = async (req,res) => {
  try{
        const {${thru}} = req.params;
        const rep =  await ${jack}Model.update(
        { where : {${thru}}},
      req.body
       );
        res.json({success : true, message : '${jack} with ' + ${thru} +' is successful updated'})
  }catch(ex){
    //ex
    res.json({success : false , message : ex.name})
  }
};`);
  });

  // controller.write("module.exports = routes");
}
module.exports = CreateController;
