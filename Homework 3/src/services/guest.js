const GuestRepositoryClass = require("../repository/GuestRepository");
const guestRepository = new GuestRepositoryClass();

class GuestService {
  getGames(req, res) {
    const teamName = req.query.teamName;

    if (!teamName) {
      const schedule = guestRepository.transformGames();
      return res.render("fullSchedule", { schedule, group: "guest" });
    }

    const result = guestRepository.getGamesByTeamName(teamName);

    if (!result) {
      return res.render("errorPage", { errMsg: "There is no such team." });
    }

    res.render("fullSchedule", { schedule: result, group: "guest" });
  }
}

module.exports = GuestService;
