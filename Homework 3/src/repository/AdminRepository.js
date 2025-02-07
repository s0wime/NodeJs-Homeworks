const teams = require("../data/teams");
const games = require("../data/games");
const results = require("../data/results");
const GuestRepository = require("./GuestRepository");

class AdminRepository extends GuestRepository {
  getGameByID(id) {
    return games.find((game) => game.id === id);
  }

  deleteGame(id) {
    games.forEach((game) => {
      if (game.id === id) {
        games.splice(games.indexOf(game), 0);
      }
    });
    console.log(games.length);
  }

  getTeamByName(name) {
    return teams.find((team) => team.name === name);
  }
}

module.exports = AdminRepository;
