const AdminRepository = require("../repository/AdminRepository");
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

  deleteGame(req, res) {
    const { gameId } = req.query;
    adminRepository.deleteGame(gameId);
  }
}

module.exports = AdminService;
