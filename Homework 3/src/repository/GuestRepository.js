const teams = require("../data/teams");
const games = require("../data/games");
const results = require("../data/results");

class GuestRepository {
  getGames(currentGames = games) {
    const fullSchedule = [];
    for (const game of currentGames) {
      const { team1Name, team2Name } = this.getTeamsByGameID(game.id);
      fullSchedule.push({
        gameId: game.id,
        date: game.date,
        team1Name: team1Name,
        team2Name: team2Name,
      });
    }
    return fullSchedule;
  }

  getTeamsByGameID(id) {
    const team1 = teams.find(
      (team) => games.find((game) => game.id === id).team1_id === team.id
    );
    const team2 = teams.find(
      (team) => games.find((game) => game.id === id).team2_id === team.id
    );
    return { team1Name: team1.name, team2Name: team2.name };
  }

  getGamesByTeamID(id) {
    const temp = games.filter(
      (game) => game.team1_id === id || game.team2_id === id
    );
    console.log(games);
    console.log(temp);
    return temp;
  }

  getGamesByTeamName(name) {
    const team = teams.find((team) => team.name === name);

    if (!team) {
      return null;
    }

    const games = this.getGamesByTeamID(team.id);
    const schedule = this.getGames(games);
    return schedule;
  }
}

module.exports = GuestRepository;
