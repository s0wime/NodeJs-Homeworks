const { name } = require("ejs");
const prisma = require("../../config/dbconfig");

class GuestRepository {
  async getGames() {
    return prisma.games.findMany({
      include: {
        team1: { select: { name: true } },
        team2: { select: { name: true } },
        team1Id: false,
        team2Id: false,
      },
    });
  }

  async getGamesByTeamName(teamName) {
    return prisma.games.findMany({
      where: {
        OR: [{ team1: { name: teamName } }, { team2: { name: teamName } }],
      },
      include: {
        team1: { select: { name: true } },
        team2: { select: { name: true } },
        team1Id: false,
        team2Id: false,
      },
    });
  }
}

module.exports = GuestRepository;
