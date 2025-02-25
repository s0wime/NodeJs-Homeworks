const { name } = require("ejs");
const prisma = require("../../config/dbconfig");

class GuestRepository {
  async getGames() {
    const games = await prisma.games.findMany({
      include: {
        team1: { select: { name: true } },
        team2: { select: { name: true } },
        results: { select: { score1: true, score2: true } },
        team1Id: false,
        team2Id: false,
      },
    });

    return this.transformGame(games);
  }

  async getGamesByTeamName(teamName) {
    const games = await prisma.games.findMany({
      where: {
        OR: [{ team1: { name: teamName } }, { team2: { name: teamName } }],
      },
      include: {
        team1: { select: { name: true } },
        team2: { select: { name: true } },
        results: { select: { score1: true, score2: true } },

        team1Id: false,
        team2Id: false,
      },
    });

    return this.transformGame(games);
  }

  transformGame(data) {
    function transformObject(obj) {
      obj.team1Name = obj.team1.name;
      obj.team2Name = obj.team2.name;
      obj.score1 = obj.results?.score1;
      obj.score2 = obj.results?.score2;
      obj.date = obj.date.toISOString().slice(0, 16);

      delete obj.team1;
      delete obj.team2;
      delete obj.results;
    }
    if (Array.isArray(data)) {
      for (const obj of data) {
        transformObject(obj);
      }
    } else {
      transformObject(data);
    }

    return data;
  }
}

module.exports = GuestRepository;
