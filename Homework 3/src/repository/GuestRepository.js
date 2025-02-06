const teams = require("../data/teams");
const games = require("../data/games");
const results = require("../data/results");

class GuestRepository {
  getAllGames() {
    return games;
  }

  getGamesByID(id) {
    return games.filter((game) => game.id === id);
  }

  getGamesByTeamName(name) {
    const team = teams.find((team) => team.name === name);

    if (!team) {
      return null;
    }

    const games = this.getGamesByID(team.id);
    return { games, team };
  }
}

module.exports = GuestRepository;
