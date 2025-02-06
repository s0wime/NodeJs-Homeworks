const GuestRepositoryClass = require("../repository/GuestRepository");
const guestRepository = new GuestRepositoryClass();

class GuestService {
  getGames(req, res) {
    const teamName = req.query.teamName;

    const schedule = guestRepository.getGames();

    if (!teamName) {
      return res.render("fullSchedule", { schedule });
    }

    const result = guestRepository.getGamesByTeamName(teamName);

    // console.log(result);

    if (!result) {
      return res.send("There is no such team.");
    }

    res.render("fullSchedule", { schedule: result });
  }

  getSchedule(req, res) {
    const schedule = guestRepository.getAllGames();
    res.render("fullSchedule", { schedule, type: "fullSchedule" });
  }

  getGameByTeam(req, res) {
    const teamName = req.query.teamName;
    const result = guestRepository.getGamesByTeamName(teamName);

    if (!result) {
      return res.send("There is no such team.");
    }

    if (!result.games?.length) {
      return res.send("This team does not have games.");
    }

    res.render("fullSchedule", {
      games: result.games,
      team: result.team,
    });
  }
}

module.exports = GuestService;
