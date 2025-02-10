const AdminRepositoryClass = require("../repository/AdminRepository");
const adminRepository = new AdminRepositoryClass();

class AdminService {
  getGames(req, res) {
    const teamName = req.query.teamName;

    if (!teamName) {
      const schedule = adminRepository.transformGames();
      return res.render("fullSchedule", { schedule, group: "admin" });
    }

    const result = adminRepository.getGamesByTeamName(teamName);

    if (!result) {
      return res.render("errorPage", { errMsg: "There is no such team." });
    }

    res.render("fullSchedule", { schedule: result, group: "admin" });
  }

  getAddPage(req, res) {
    const teams = adminRepository.getTeams();
    res.render("addGame", { teams });
  }

  addGame(req, res) {
    const { body } = req;
    adminRepository.addGame(body);
    res.redirect("viewSchedule/");
  }

  getEditingPage(req, res) {
    const {
      query: { gameId },
    } = req;
    const game = adminRepository.getGameByID(parseInt(gameId));
    const teams = adminRepository.getTeams();
    const result = adminRepository.getResultByGameID(parseInt(gameId));

    res.render("editGame", { game, teams, result });
  }

  editGame(req, res) {
    const { body } = req;
    res.send("all ok");

    console.log(body);
  }

  deleteGame(req, res) {
    const {
      params: { gameId },
    } = req;

    const parsedGameId = parseInt(gameId);

    if (isNaN(parsedGameId)) {
      return res.render("errorPage", { errMsg: "There is no such game." });
    }

    adminRepository.deleteGame(parsedGameId);
    res.status(200).send({ message: "ok" });
  }
}

module.exports = AdminService;
