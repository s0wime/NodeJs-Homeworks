const teams = require("../data/teams");
const games = require("../data/games");
const results = require("../data/results");

class GuestRepository {
  transformGames(currentGames = games) {
    const fullSchedule = [];
    for (const game of currentGames) {
      const { team1Name, team2Name } = this.getTeamsByGameID(game.id);
      const results = this.getResultByGameID(game.id);
      fullSchedule.push({
        gameId: game.id,
        date: game.date,
        team1Name: team1Name,
        team2Name: team2Name,
        team1Score: results?.score1,
        team2Score: results?.score2,
      });
    }
    return fullSchedule.sort((a, b) => {
      return (
        this.convertTimestampToNumber(a.date) -
        this.convertTimestampToNumber(b.date)
      );
    });
  }

  convertTimestampToNumber(timestamp) {
    return new Date(timestamp).getTime();
  }

  getResultByGameID(id) {
    return results.find((result) => result.game_id === id);
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
    return games.filter((game) => game.team1_id === id || game.team2_id === id);
  }

  getGamesByTeamName(name) {
    const team = teams.find((team) => team.name === name);

    if (!team) {
      return null;
    }

    const games = this.getGamesByTeamID(team.id);
    return this.transformGames(games);
  }
}

module.exports = GuestRepository;
