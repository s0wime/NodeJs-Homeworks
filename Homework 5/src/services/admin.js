const AdminRepositoryClass = require("../repository/AdminRepository");
const adminRepository = new AdminRepositoryClass();

class AdminService {
  async getGames(req, res) {
    const { teamName, dateSort, gameStatus } = req.query;

    console.log(dateSort);

    if (!teamName) {
      adminRepository
        .getGames()
        .then((schedule) => {
          if (dateSort === "desc") {
            schedule.sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            });
          } else if (dateSort === "asc") {
            schedule.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });
          }

          res.render("fullSchedule", { schedule, group: "admin" });
        })
        .catch(() => {
          res.render("errorPage", { errMsg: "Server Error" });
        });
      return;
    }

    adminRepository
      .getGamesByTeamName(teamName)
      .then((games) => {
        if (!games) {
          return res.render("errorPage", { errMsg: "No games found" });
        }

        res.render("fullSchedule", { schedule: games, group: "admin" });
      })
      .catch(() => {
        res.render("errorPage", { errMsg: "Server Error" });
      });
  }

  async getAddPage(req, res) {
    const teams = await adminRepository.getTeams();
    if (!teams) {
      res.render("errorPage", { errMsg: "No teams available" });
    }

    res.render("addGame", { teams });
  }

  addGame(req, res) {
    const { body } = req;
    adminRepository
      .addGame(body)
      .then(() => {
        res.redirect("viewSchedule/");
      })
      .catch(() => {
        res.render("errorPage", { errMsg: "Server Error" });
      });
  }

  async getEditingPage(req, res) {
    const {
      query: { gameId },
    } = req;

    if (!gameId) {
      return res.render("errorPage", { errMsg: "Bad request" });
    }

    const game = await adminRepository.getGameByID(parseInt(gameId));
    if (!game) {
      res.render("errorPage", { errMsg: "No game available" });
    }
    const teams = await adminRepository.getTeams();

    res.render("editGame", {
      game,
      teams,
      result: { score1: game.score1, score2: game.score2 },
    });
  }

  async editGame(req, res) {
    const {
      body: { gameId, team1Name, team2Name, team1Score, team2Score, date },
    } = req;

    const updatedGame = {};
    const updatedResult = {};

    if (gameId) {
      updatedGame.id = gameId;
    } else {
      throw new Error("No gameId provided");
    }

    if (team1Name && team2Name) {
      updatedGame.team1 = team1Name;
      updatedGame.team2 = team2Name;
    }

    if (date) {
      updatedGame.date = date;
    }

    if (!isNaN(team1Score) && !isNaN(team2Score)) {
      updatedResult.score1 = team1Score;
      updatedResult.score2 = team2Score;
    }

    const isSuccess = await adminRepository.updateGame({
      updatedGame,
      updatedResult,
    });

    if (isSuccess) {
      return res.send("all ok");
    } else {
      res.status(500).send("Something went wrong");
    }
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
