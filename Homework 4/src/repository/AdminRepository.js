const fs = require("node:fs");
const fsPromises = require("node:fs").promises;
const path = require("node:path");
const GuestRepository = require("./GuestRepository");
const client = require('../../config/dbconfig')

class AdminRepository extends GuestRepository {

  async updateGameAsyncAwait(game, result) {
    try {
      const data = await fsPromises.readFile(
        path.join(__dirname, "../data/games.json"),
        "utf-8"
      );
      const parsedData = JSON.parse(data);
      const indexOfGame = parsedData.findIndex(
        (currentGame) => currentGame.id === game.id
      );
      if (indexOfGame === -1) {
        return;
      }
      parsedData[indexOfGame] = { ...parsedData[indexOfGame], ...game };

      await fsPromises.writeFile(
        path.join(__dirname, "../data/games.json"),
        JSON.stringify(parsedData)
      );

      const resultsData = await fsPromises.readFile(
        path.join(__dirname, "../data/results.json"),
        "utf-8"
      );

      const parsedResultsData = JSON.parse(resultsData);
      const indexOfResult = parsedResultsData.findIndex(
        (currentResult) => currentResult.id === result.id
      );
      if (indexOfResult === -1) {
        parsedResultsData.push(result);
      } else {
        parsedResultsData[indexOfResult] = {
          ...parsedResultsData[indexOfResult],
          ...result,
        };
      }

      await fsPromises.writeFile(
        path.join(__dirname, "../data/results.json"),
        JSON.stringify(parsedResultsData)
      );
    } catch (err) {
      console.log(err);
    }
  }

  async updateGame(game, result) {

    try {
      await client.query('BEGIN')

      const updateQuery = `UPDATE games SET team1=${game.team1_id}, team2=${game.team2_id}, date=${game.date} WHERE id=${game.id}`
      client.query(updateQuery, (err, res) => {
        if (err) {
          throw new Error(err);
        }
      });
    } catch(e) {
      console.log(e);
      await client.query('ROLLBACK');
    }
  }

  getGameByID(id) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM games WHERE id=${id}`, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    })
  }

  deleteResult(gameId) {
    return new Promise((resolve, reject) => {
      client.query(`DELETE FROM results WHERE gameId=${gameId}`, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      })
    })
  }

  deleteGameById(id) {
    return new Promise((resolve, reject) => {
      client.query(`DELETE FROM games WHERE id=${id}`, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      })
    })
  }

  async deleteGame(id) {
    await this.deleteResult(id);
    await this.deleteGameById("games", id);
  }

  getTeams() {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM teams`, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    })
  }

  getTeamByName(name) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM teams WHERE name=${name}`, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    })
  }

  async addGame(body) {
    const { team1Name, team2Name, date } = body;

    if (team1Name === team2Name) {
      return;
    }

    const team1ID = await this.getTeamByName(team1Name).id;
    const team2ID = await this.getTeamByName(team2Name).id;

    if (isNaN(team1ID) || isNaN(team2ID)) {
      return;
    }

    const games = this.getSync("games");
    const lastID = games[games.length - 1]?.id || 0;

    const newGame = {
      id: lastID + 1,
      date: date,
      team1_id: team1ID,
      team2_id: team2ID,
    };

    this.updateWithCallback("games", newGame);
  }

  addResult(gameId, result) {
    results.push({
      id: results[results.length - 1]?.id + 1 || 1,
      game_id: gameId,
      score1: result.score1,
      score2: result.score2,
    });
  }

  updateGame(values) {
    const { gameId, updatedGame, updatedResult } = values;
    updatedResult.id = this.getResultByGameID(gameId)?.id;
    updatedGame.id = gameId;

    const currentResults = this.getSync("results");

    const resultIndex = currentResults.findIndex(
      (result) => result.id === updatedResult.id
    );

    if (resultIndex === -1) {
      updatedResult.id = currentResults[currentResults.length - 1]?.id + 1 || 1;
      updatedResult.game_id = gameId;
    }

    this.updateGameAsyncAwait(updatedGame, updatedResult);

    // if (resultIndex !== -1) {
    //   results[resultIndex] = { ...results[resultIndex], ...updatedResult };
    // } else {
    //   this.addResult(gameId, updatedResult);
    // }
  }
}

module.exports = AdminRepository;
