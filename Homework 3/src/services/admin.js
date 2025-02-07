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

    res.render("fullSchedule", { schedule: result, group: "admin" })
  }

  getAddPage(req, res) {
    const teams = adminRepository.getTeams();
    res.render('modal', {teams});
  }

  addGame(req, res) {
    console.log(req.body.team1)
    console.log(req.body.team2)
    res.send('all ok');
  }

  deleteGame(req, res) {
    const { gameId } = req.params;
    adminRepository.deleteGame(parseInt(gameId));
    res.status(200).send({message: 'ok'})
  }
}

module.exports = AdminService;
