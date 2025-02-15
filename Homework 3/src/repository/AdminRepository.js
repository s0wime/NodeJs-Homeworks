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

  getGameByID(id) {
    return this.getSync("games").find((game) => game.id === id);
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
