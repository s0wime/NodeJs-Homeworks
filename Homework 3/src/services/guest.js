const GuestRepositoryClass = require("../repository/GuestRepository");
const guestRepository = new GuestRepositoryClass();

class GuestService {
  getSchedule(req, res) {
    res.send(guestRepository.getAllGames());
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

    res.send({ games: result.games, team: result.team });
  }
}

module.exports = GuestService;
