const fs = require("node:fs");
const path = require("node:path");

class GuestRepository {
  getSync(value) {
    try {
      const data = fs.readFileSync(
        path.join(__dirname, `../data/${value}.json`),
        "utf-8"
      );
      return JSON.parse(data);
    } catch (e) {
      console.log(e);
    }
  }

  transformGames(currentGames = this.getSync("games")) {
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
    return (
      this.getSync("results").find((result) => result.game_id === id) || ""
    );
  }

  getTeamsByGameID(id) {
    const team1 = this.getSync("teams").find(
      (team) =>
        this.getSync("games").find((game) => game.id === id).team1_id ===
        team.id
    );
    const team2 = this.getSync("teams").find(
      (team) =>
        this.getSync("games").find((game) => game.id === id).team2_id ===
        team.id
    );
    return { team1Name: team1.name, team2Name: team2.name };
  }

  getGamesByTeamID(id) {
    return this.getSync("games").filter(
      (game) => game.team1_id === id || game.team2_id === id
    );
  }

  getGamesByTeamName(name) {
    const team = this.getSync("teams").find((team) => team.name === name);

    if (!team) {
      return null;
    }

    const games = this.getGamesByTeamID(team.id);
    return this.transformGames(games);
  }
}

module.exports = GuestRepository;
