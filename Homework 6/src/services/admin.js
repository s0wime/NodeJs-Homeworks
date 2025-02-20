const AdminRepositoryClass = require("../repository/AdminRepository");
const DateHandlerClass = require("../utils/DateHandler");
const adminRepository = new AdminRepositoryClass();
const dateHandler = new DateHandlerClass();

class AdminService {
  async getGames(req, res) {
    const { teamName, dateSort, gameStatus, page } = req.query;
    const parsedPage = parseInt(page);

    if (!teamName) {
      adminRepository
        .getGames()
        .then((schedule) => {
          const totalPages = Math.trunc(schedule.length / 10);

          switch (dateSort) {
            case "desc":
              schedule.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
              });
              break;
            case "asc":
              schedule.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
              });
              break;
            default:
              break;
          }

          switch (gameStatus) {
            case "completed":
              schedule = [
                ...schedule.filter((game) => game.score1 && game.score2),
              ];
              break;
            case "upcoming":
              schedule = [
                ...schedule.filter((game) => !game.score1 && !game.score2),
              ];
              break;
          }

          if (parsedPage) {
            schedule = schedule.slice(parsedPage * 10 - 10, parsedPage * 10);
          }

          res.render("fullSchedule", { schedule, group: "admin", totalPages });
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

        switch (dateSort) {
          case "desc":
            games.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });
            break;
          case "asc":
            games.sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            });
            break;
          default:
            break;
        }

        switch (gameStatus) {
          case "completed":
            games = [...games.filter((game) => game.score1 && game.score2)];
            break;
          case "upcoming":
            games = [...games.filter((game) => !game.score1 && !game.score2)];
            break;
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
    body.date = dateHandler.dateStringWithoutTimezone(body.date);
    adminRepository
      .addGame(body)
      .then(() => {
        res.redirect("./");
      })
      .catch(() => {
        res.render("errorPage", { errMsg: "Server Error" });
      });
  }

  async getEditingPage(req, res) {
    const {
      params: { id },
    } = req;

    if (!id) {
      return res.render("errorPage", { errMsg: "Bad request" });
    }

    const game = await adminRepository.getGameByID(parseInt(id));
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
      updatedGame.date = dateHandler.dateStringWithoutTimezone(date);
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
      params: { id },
    } = req;

    const parsedGameId = parseInt(id);

    if (isNaN(parsedGameId)) {
      return res.render("errorPage", { errMsg: "There is no such game." });
    }

    adminRepository.deleteGame(parsedGameId).then((response) => {
      if (response.msg) {
        res.render("errorPage", { errMsg: response.msg });
      } else {
        res.status(200).send({ message: "ok" });
      }
    });
  }
}

module.exports = AdminService;
