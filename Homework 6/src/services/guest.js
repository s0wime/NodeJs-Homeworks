const GuestRepositoryClass = require("../repository/GuestRepository");
const guestRepository = new GuestRepositoryClass();

class GuestService {
  async getGames(req, res) {
    const { teamName, dateSort, gameStatus, page } = req.query;
    const parsedPage = parseInt(page);

    if (!teamName) {
      guestRepository
        .getGames()
        .then((schedule) => {
          const totalPages = Math.ceil(schedule.length / 10);

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

          if (parsedPage) {
            schedule = schedule.slice(parsedPage * 10 - 10, parsedPage * 10);
          } else {
            schedule = schedule.slice(0, 10);
          }

          res.render("fullSchedule", { schedule, group: "guest", totalPages });
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

        switch (dateSort) {
          case "desc":
            games.sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            });
            break;
          case "asc":
            games.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
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

        res.render("fullSchedule", { schedule: games, group: "guest" });
      })
      .catch(() => {
        res.render("errorPage", { errMsg: "Server Error" });
      });
  }
}

module.exports = GuestService;
