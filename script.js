// https://www.themealdb.com/api.php
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  // const selectMealImage = document.getElementById("random-pic");

  const url = "https://www.themealdb.com/api/json/v1/1/random.php";
  https.get(url, function(response) {
    var data;
    //first in "data" even we will collect all the data in chunks
    response.on("data", function(chunk) {
      if (!data) {
        data = chunk;
      } else {
        data += chunk;
      }
    });
    //in the end event the data will be parsed
    response.on("end", function() {
      const randomData = JSON.parse(data);
      // console.log(randomData);
      const randomMealName = randomData.meals[0].strMeal;
      const randomMealImage = randomData.meals[0].strMealThumb;
      // console.log(randomMealName);
      // console.log(randomMealImage);
      res.render("index", {
        recipeName: randomMealName,
        randomPic: randomMealImage
      });
      // selectMealImage.innerHTML=randomMealImage;
    });
  });
});

app.post("/", function(req, res) {
  const searchInput = req.body.searchInput;
  const searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchInput;
  console.log(searchUrl);
  https.get(searchUrl, function(response) {
    var data;
    //first in "data" even we will collect all the data in chunks
    response.on("data", function(chunk) {
      if (!data) {
        data = chunk;
      } else {
        data += chunk;
      }
    });
    //in the end event the data will be parsed
    response.on("end", function() {
      const searchData = JSON.parse(data);
      // console.log(searchData);
      const searchMealName = searchData.meals[0].strMeal;
      const searchMealImage = searchData.meals[0].strMealThumb;
      const searchMealInstruction = searchData.meals[0].strInstructions;
      console.log(searchMealName);
      console.log(searchMealImage);
      console.log(searchMealInstruction);
      res.render("recipeDetails", {
        recipeName: searchMealName,
        recipePic: searchMealImage,
        recipeSteps: searchMealInstruction
      });
    });
  });
});

// click on image and it goes to recipeDetails
app.get("/category/:paramsName", function(req, res) {
  const mealId = req.params.paramsName;
  console.log(mealId);
  const idUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId;
  console.log(idUrl);
  https.get(idUrl, function(response) {
    var data;
    response.on("data", function(chunk) {
      if (!data) {
        data = chunk;
      } else {
        data += chunk;
      }
    });
    response.on("end", function() {
      const idMealData = JSON.parse(data);
      console.log(idMealData);
      const idMealName = idMealData.meals[0].strMeal;
      const idMealImage = idMealData.meals[0].strMealThumb;
      const idMealInstruction = idMealData.meals[0].strInstructions;
      res.render("recipeDetails", {
        recipeName: idMealName,
        recipePic: idMealImage,
        recipeSteps: idMealInstruction
      })
    });
  });
});

//category click

app.post("/category/:paramsName", function(req, res) {
  const categoryName = req.params.paramsName;
  console.log(categoryName);
  const categoryUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + categoryName;
  console.log(categoryUrl);
  https.get(categoryUrl, function(response) {
    var data;
    response.on("data", function(chunk) {
      if (!data) {
        data = chunk;
      } else {
        data += chunk;
      }
    });
    response.on("end", function() {
      const categoryData = JSON.parse(data);
      console.log(categoryData);
      res.render("categoryRecipe", {
        categoryHead: categoryName.toUpperCase(),
        mealList: categoryData
      });
    });
  });
});

app.listen("3000", function() {
  console.log("Server has started and is running on port 3000");
});
