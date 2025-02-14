const GuestRepositoryClass = require("../repository/GuestRepository");
const guestRepository = new GuestRepositoryClass();

class GuestService {
  async getGames(req, res) {
    const { teamName, dateSort, gameStatus } = req.query;

    if (!teamName) {
      guestRepository
        .getGames()
        .then((schedule) => {
          switch (dateSort) {
            case "desc":
              schedule.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
              });
              break;
            case "asc":
              schedule.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
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

          res.render("fullSchedule", { schedule, group: "guest" });
        })
        .catch(() => {
          res.render("errorPage", { errMsg: "Server Error" });
        });
      return;
    }

    guestRepository
      .getGamesByTeamName(teamName)
      .then((games) => {
        if (!games) {
          return res.render("errorPage", { errMsg: "No games found" });
        }

        res.render("fullSchedule", { schedule: games, group: "guest" });
      })
      .catch(() => {
        res.render("errorPage", { errMsg: "Server Error" });
      });
  }
}

module.exports = GuestService;
