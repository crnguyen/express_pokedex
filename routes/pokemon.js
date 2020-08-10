const express = require('express');
const router = express.Router();
const db = require("../models");
const axios = require("axios");
const methodOverride = require("method-override");
const app = express();
app.use(methodOverride("_method"));

router.get('/', async (req, res) => {
  try {
    const foundPokemon = await db.pokemon.findAll(); //grab info from pokemon data table
    res.render("favorites", {pokemon: foundPokemon})
  } catch (err){
    res.render("error");
  }
});

router.post('/', async (req, res) => {
  try {
    await db.pokemon.findOrCreate({
      where: {
        name: req.body.name
      },
    })
    res.redirect("/pokemon")
  } catch (err) {
    res.render("error"); //also render an error page
  }
});

router.get("/:name", async (req,res) => {
  try {
    if (req.params && req.params.name){
      const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${req.params.name.toLowerCase()}`;
      const result = await axios.get(pokemonURL);
      let pokemonResults = result.data;
      res.render("show", {pokedata: pokemonResults})
    }
  } catch (err) {
    res.render("error");
  }
})

router.delete("/", async (req, res) => {
  try {
    await db.pokemon.destroy({
      where: {
        name: req.body.name,
      },
    });
    res.redirect("/pokemon");
  } catch (error) {
    res.render("error");
  }
});

module.exports = router;
