let Router = require('express').Router;
let router = (module.exports = Router());
const csv=require('csvtojson')

let ingredients = [], formulations = [], formulation_ingredients = [];
function loadIngredients() {
  csv()
    .fromFile('./api/ingredients.csv')
    .on('json',(jsonObj)=>{
      ingredients.push({
        id: parseInt(jsonObj.id),
        name: jsonObj.name,
        minimum_percentage: parseFloat(jsonObj.minimum_percentage),
        maximum_percentage: parseFloat(jsonObj.maximum_percentage),
        description: jsonObj.description,
        classes: JSON.parse(jsonObj.classes),
      });
    })
    .on('done',(error)=>{
      console.log('loadIngredients', ingredients.length, error);
    })
}

function loadFormulations() {
  csv()
    .fromFile('./api/formulations.csv')
    .on('json',(jsonObj)=>{
      formulations.push({
        id: parseInt(jsonObj.id),
        name: jsonObj.name
      });
    })
    .on('done',(error)=>{
      console.log('loadFormulations', formulations.length, error);
    })
}

function loadFormulationIngredients() {
  csv()
    .fromFile('./api/formulation_ingredients.csv')
    .on('json',(jsonObj)=>{
      formulation_ingredients.push({
        formulation_id: parseInt(jsonObj.formulation_id),
        ingredient_id: parseInt(jsonObj.ingredient_id),
        percentage: parseFloat(jsonObj.percentage)
      });
    })
    .on('done',(error)=>{
      console.log('loadFormulationIngredients', formulation_ingredients.length, error);
    })
}

loadIngredients();
loadFormulations();
loadFormulationIngredients();

router.route('/api/ingredients').get(function(req, res) {
  res.status(200).json({
    success: true,
    count: ingredients.length,
    data: ingredients,
  });
})

router.route('/api/formulations').get(function(req, res) {
  res.status(200).json({
    success: true,
    count: formulations.length,
    data: formulations,
  });
})

router.route('/api/formulation_ingredients').get(function(req, res) {
  res.status(200).json({
    success: true,
    count: formulation_ingredients.length,
    data: formulation_ingredients,
  });
})