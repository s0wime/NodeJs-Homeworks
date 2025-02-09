const teams = require("../data/teams");
const games = require("../data/games");
const results = require("../data/results");
const GuestRepository = require("./GuestRepository");

class AdminRepository extends GuestRepository {
  getGameByID(id) {
    return games.find((game) => game.id === id);
  }

  deleteResult(gameId) {
    results.forEach((result) => {
      if (result.game_id === gameId) {
        results.splice(results.indexOf(result), 1);
      }
    });
  }

  deleteGame(id) {
    this.deleteResult(id);
    games.forEach((game) => {
      if (game.id === id) {
        games.splice(games.indexOf(game), 1);
      }
    });
  }

  getTeams() {
    return teams;
  }

  getTeamByName(name) {
    return teams.find((team) => team.name === name);
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

    const lastID = games[games.length - 1]?.id || 0;

    const newGame = {
      id: lastID + 1,
      date: date,
      team1_id: team1ID,
      team2_id: team2ID,
    };

    games.push(newGame);
  }
}

module.exports = AdminRepository;
