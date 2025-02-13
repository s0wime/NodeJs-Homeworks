const GuestRepositoryClass = require("../repository/GuestRepository");
const guestRepository = new GuestRepositoryClass();

class GuestService {
    async getGames(req, res) {
        const teamName = req.query.teamName;

        if (!teamName) {
            guestRepository.getGames()
                .then(schedule => {
                    console.log(schedule)
                  res.render("fullSchedule", {schedule, group: "guest"});
                })
                .catch(() => {
                  res.render("errorPage", {errMsg: "Server Error"})
                })
            return;
        }

        guestRepository.getGamesByTeamName(teamName)
            .then(games => {
                if(!games) {
                    return res.render("errorPage", {errMsg: "No games found"})
                }

              res.render("fullSchedule", {schedule: games, group: "guest"});
            })
            .catch(() => {
              res.render("errorPage", {errMsg: "Server Error"})
            })
    }
}

module.exports = GuestService;
