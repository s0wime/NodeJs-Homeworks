const GuestRepositoryClass = require("../repository/GuestRepository");
const guestRepository = new GuestRepositoryClass();

class GuestService {
  getSchedule(req, res) {
    res.send(guestRepository.getAllGames());
  }

  getGameByTeam(req, res) {
    const { teamName } = req.params;
    const { games, team } = guestRepository.getGamesByTeamName(teamName);

    if (!team) {
      return res.send("There is no such team.");
    }

    if (!games.length) {
      return res.send("This team does not have games.");
    }

    res.send({ games, team });
  }
}

module.exports = GuestService;
