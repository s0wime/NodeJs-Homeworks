const GuestRepositoryClass = require("../repository/guestRepository");
const guestRepository = new GuestRepositoryClass();

class GuestService {
  getSchedule(req, res) {
    res.send(guestRepository.getAllGames());
  }
}

module.exports = GuestService;
