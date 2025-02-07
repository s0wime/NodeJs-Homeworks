const teams = require("../data/teams");
const games = require("../data/games");
const results = require("../data/results");
const GuestRepository = require("./GuestRepository");

class AdminRepository extends GuestRepository {
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
