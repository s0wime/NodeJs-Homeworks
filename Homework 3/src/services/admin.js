const AdminRepositoryClass = require("../repository/AdminRepository");
const adminRepository = new AdminRepositoryClass();

class AdminService {
  renderHelloWorld(req, res) {
    res.send(adminRepository.printHelloWorld());
  }

  viewEditingPage(req, res) {
    return res.render("editGame");
  }

  editGame(req, res) {
    const { gameId } = req.query;
    const body = req.body;
    console.log(body);
    const game = adminRepository.getGameByID(gameId);

    if (!game) {
      return res.render("errorPage", { errMsg: "This game does not exist" });
    }

    if (adminRepository.getTeamByName(body.newTeamName1)) {
      game.team1_id = newTeam1;
    }

    if (adminRepository.getTeamByName(body.newTeamName2)) {
      game.team2_id = newTeam2;
    }

    if (newDate) {
      game.date = newDate;
    }
  }
}

module.exports = AdminService;
