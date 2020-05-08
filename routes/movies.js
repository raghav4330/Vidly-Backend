const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Movie, validate } = require("../modals/movie");
const { genreSchema, Genre } = require("../modals/genre");

router.get("/", async (req, res) => {
  const movies = await Movie.find().select("-__v").sort("title");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findOne({ _id: req.params.id }).select("-__v");
  if (!movie)
    return res.status(404).send("The movie with the specified id not found");
  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Inavlid Genre");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie = await movie.save(); // actually , no need to get reset movie object...as id is set by mongodb driver before saving only.so ovie already have the id before saving....   await movie.save()  was enough to write on yhis line.
  res.send(movie);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Inavlid Genre");

  const movie = await Movie.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
    },
    { new: true }
  );
  if (!movie)
    return res.status(404).send("The movie with the specified id not found");

  res.send(movie);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndRemove({ _id: req.params.id });
  if (!movie)
    return res.status(404).send("The movie with the specified id not found");

  res.send(movie);
});

module.exports = router;
