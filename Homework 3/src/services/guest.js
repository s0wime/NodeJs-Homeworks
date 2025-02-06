const GuestRepositoryClass = require("../repository/GuestRepository");
const guestRepository = new GuestRepositoryClass();

class GuestService {
  getSchedule(req, res) {
    const schedule = guestRepository.getAllGames();
    res.render("schedule", { schedule });
  }

  getGameByTeam(req, res) {
    const { teamName } = req.params;
    const result = guestRepository.getGamesByTeamName(teamName);

    if (!result) {
      return res.send("There is no such team.");
    }

    if (!result.games?.length) {
      return res.send("This team does not have games.");
    }

    // res.render("schedule", { games: result.games, team: result.team });
  }
}

module.exports = GuestService;
