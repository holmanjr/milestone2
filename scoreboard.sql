DROP DATABASE IF EXISTS scoreboard;
CREATE DATABASE scoreboard;

\c scoreboard;

CREATE TABLE player (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  score INTEGER
);

INSERT INTO player (name, score)
  VALUES ('Giant Loser', 9999);
