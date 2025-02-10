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
    const {
      body: { gameId, team1Name, team2Name, team1Score, team2Score, date },
    } = req;

    const updatedGame = {};
    const updatedResult = {};

    const team1Id = team1Name
      ? adminRepository.getTeamByName(team1Name).id
      : "";
    const team2Id = team2Name
      ? adminRepository.getTeamByName(team2Name).id
      : "";

    if (team1Id && team2Id) {
      updatedGame.team1_id = team1Id;
      updatedGame.team2_id = team2Id;
    }

    if (date) {
      updatedGame.date = date;
    }

    if (!isNaN(team1Score) && !isNaN(team2Score)) {
      updatedResult.score1 = team1Score;
      updatedResult.score2 = team2Score;
    }

    adminRepository.updateGame({ gameId, updatedGame, updatedResult });

    return res.send("all ok");
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
