require('dotenv').load();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL);

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())

app.use(function(req, res, next){
  if(req.query._method == 'DELETE'){
    req.method = 'DELETE';
    req.url = req.path;
  }
  next();
});

app.get('/', function(req, res, next){
  db.any('SELECT * FROM player')
  .then(function(data){
    return res.render('index', {player: data});
  })
  .catch(function(err){
    return next(err);
  })
});

app.post('/user', function(req, res, next){
  db.none('INSERT INTO player(name)' +
    'VALUES($1)',
    [req.body.username])
  .then(function(result){
    res.redirect('/');
  })
});

app.get('/game/:id', function(req, res, next){
  var id = parseInt(req.params.id);
  db.one('SELECT * FROM player WHERE id = $1', id)
  .then(function(data){
    res.render('game', {player: data})
  })
  .catch(function(err){
    return next(err);
  });
});

app.get('/scoreboard', function(req, res, next){
  db.any('SELECT * FROM player')
  .then(function(data){
    return res.render('scoreboard', {player: data});
  })
  .catch(function(err){
    return next(err);
  })
});

app.post('/scoreboard/:id', function(req, res, next){
  db.none('UPDATE player SET score=$1 WHERE id=$2',
  [req.body.score, parseInt(req.params.id)])
  .then(function(){
    res.redirect('/scoreboard');
  })
  .catch(function(err){
    return next(err);
  });
});

app.listen(process.env.PORT, function(){
  console.log("Application running on localhost:3000")
});
