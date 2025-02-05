const teams = require("../data/teams");
const games = require("../data/games");
const results = require("../data/results");

class GuestRepository {
  getAllGames() {
    return games;
  }
  getGameByID(id) {
    return games.find((game) => game.id === id);
  }
  getGamesByTeamName(name) {
    const teamsByName = teams.find((team) => team.name === name);
    const games = [];
    teamsByName.forEach((team) => {
      games.push(this.getGameByID(team.id));
    });
    return { games, teamsByName };
  }
}

module.exports = GuestRepository;
