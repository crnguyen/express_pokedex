const express = require('express');
const router = express.Router();
const db = require("../models");
const axios = require("axios");

// GET /pokemon - return a page with favorited Pokemon
router.get('/', async (req, res) => {
  try {
    const foundPokemon = await db.pokemon.findAll(); //grab info from pokemon data table
    res.render("favorites", {pokemon: foundPokemon})
  } catch (err){
    res.render("error");
  }
});

//add pokemon to database
// POST /pokemon - receive the name of a pokemon and add it to the database
router.post('/', async (req, res) => {
  // TODO: Get form data and add a new record to DB
  try {
    await db.pokemon.findOrCreate({
      where: {
        name: req.body.name
      },
    })
    res.redirect("/pokemon")
  } catch (err) {
    res.render("error");
    //also render an error page
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

module.exports = router;
