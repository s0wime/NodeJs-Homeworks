const teams = require("../data/teams");
const games = require("../data/games");
const results = require("../data/results");

class AdminRepository {
  printHelloWorld() {
    return "Hello World";
  }

  getGameByID(id) {
    return games.find((game) => game.id === id);
  }

  getTeamByName(name) {
    return teams.find((team) => team.name === name);
  }
}

module.exports = AdminRepository;
