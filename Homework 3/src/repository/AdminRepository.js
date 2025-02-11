const fs = require("node:fs");
const fsPromises = require("node:fs").promises;
const path = require("node:path");
const GuestRepository = require("./GuestRepository");

class AdminRepository extends GuestRepository {
  updateWithCallback(fileName, info) {
    fs.readFile(
      path.join(__dirname, `../data/${fileName}.json`),
      "utf-8",
      (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        const games = JSON.parse(data);
        games.push(info);

        fs.writeFile(
          path.join(__dirname, `../data/${fileName}.json`),
          JSON.stringify(games),
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    );
  }

  deleteWithPromise(fileName, objId) {
    fsPromises
      .readFile(path.join(__dirname, `../data/${fileName}.json`), "utf-8")
      .then((data) => {
        const parsedData = JSON.parse(data);
        const updatedData = parsedData.filter((obj) => obj.id !== objId);

        fsPromises
          .writeFile(
            path.join(__dirname, `../data/${fileName}.json`),
            JSON.stringify(updatedData)
          )
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getGameByID(id) {
    return this.getSync(games).find((game) => game.id === id);
  }

  deleteResult(gameId) {
    const results = this.getSync("results");
    const resultIdByGame = results.find(
      (result) => result.game_id === gameId
    )?.id;

    if (resultIdByGame) {
      this.deleteWithPromise("results", resultIdByGame);
    }
  }

  deleteGame(id) {
    this.deleteResult(id);
    this.deleteWithPromise("games", id);
  }

  getTeams() {
    return this.getSync("teams");
  }

  getTeamByName(name) {
    return this.getSync("teams").find((team) => team.name === name);
  }

  addGame(body) {
    const { team1Name, team2Name, date } = body;

    if (team1Name === team2Name) {
      return;
    }

    const team1ID = this.getTeamByName(team1Name).id;
    const team2ID = this.getTeamByName(team2Name).id;

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
    const resultId = this.getResultByGameID(gameId)?.id;

    const gameIndex = games.findIndex((game) => game.id === gameId);
    if (gameIndex === -1) {
      return;
    }
    games[gameIndex] = { ...games[gameIndex], ...updatedGame };

    const resultIndex = results.findIndex((result) => result.id === resultId);
    if (resultIndex !== -1) {
      results[resultIndex] = { ...results[resultIndex], ...updatedResult };
    } else {
      this.addResult(gameId, updatedResult);
    }
  }
}

module.exports = AdminRepository;
