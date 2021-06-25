var express = require('express');
var router = express.Router();
var movies = require('./movies.json')
const fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.query.title) {
  res.json(movies)
     .status(200)
     .end()
  } else {
    let check = req.query.title
    let movie = movies.filter(movie => {
      return movie.title.toLowerCase() === check.toLowerCase()
  });
  if(movie.length > 0) {
    res.send(movie).end()
  } else {
    res.status(404).end()
  }
 }
});

router.get('/:id', function( req, res ) {
  let check = req.params.id
  let movie = movies.filter(movie => {
    return movie.id === Number(check)
  })
  if (isNaN(check)) {
    res.status(400).end()
  }
  else if (movie.length > 0) {
    res.status(200)
       .send(movie)
  } else {
    res.status(404).end()
  }
})


router.post('/', function (req, res) {
  let newMovie = req.body
  console.log(newMovie)
  newMovie.id = movies.length + 1
  newMovie.runtime = Number(newMovie.runtime)
  newMovie.release_year = Number(newMovie.release_year)
  movies.push(newMovie)
  fs.writeFile('./routes/movies.json', JSON.stringify(movies), (err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200)
        .send('Movie posted')
    }
  })
})

router.delete('/:id', (req, res) => {
  let deleteMovie = req.params.id
  let newMovies = movies.filter(movie => {
    return movie.id !== Number(deleteMovie)
  })
  if(newMovies.length === movies.length) {
    res.status(404).send("Movie not found, no movie deleted")
  } else {
  fs.writeFile('./routes/movies.json', JSON.stringify(newMovies), (err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200)
        .send('Movie deleted')
    }
   })
  }
})

module.exports = router;
