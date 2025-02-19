const GuestRepository = require("./GuestRepository");
const client = require("../../config/dbconfig");
const prisma = require("../../config/dbconfig");

class AdminRepository extends GuestRepository {
  async getGameByID(id) {
    const game = await prisma.games.findFirst({
      where: { id },
      include: {
        team1: { select: { name: true } },
        team2: { select: { name: true } },
        results: { select: { score1: true, score2: true } },

        team1Id: false,
        team2Id: false,
      },
    });

    return this.transformGame(game);
  }

  async deleteGame(id) {
    try {
      await prisma.$transaction([
        prisma.results.deleteMany({
          where: { gameId: id },
        }),
        prisma.games.delete({
          where: { id },
        }),
      ]);
      return {};
    } catch (err) {
      return { msg: err.message };
    }
  }

  async getTeams() {
    return prisma.teams.findMany();
  }

  async addGame(body) {
    const { team1Name, team2Name, date } = body;

    console.log(team1Name, team2Name, date);

    if (team1Name === team2Name) {
      return;
    }

    await prisma.games.create({
      data: {
        team1: { connect: { name: team1Name } },
        team2: { connect: { name: team2Name } },
        date,
      },
    });
  }

  async updateGame(values) {
    const { updatedGame, updatedResult } = values;

    try {
      console.log(updatedGame);
      if (updatedGame?.team1 && updatedGame?.team2) {
        await prisma.games.update({
          where: { id: updatedGame.id },
          data: {
            team1: { connect: { name: updatedGame.team1 } },
            team2: { connect: { name: updatedGame.team2 } },
            date: updatedGame.data,
          },
        });
      }

      if (updatedResult?.score1 && updatedResult?.score2) {
        await this.updateGameResult(updatedGame.id, updatedResult);
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to update game: ${error.message}`);
    }
  }

  async updateGameResult(gameId, result) {
    const resultExist = await prisma.results.findUnique({
      where: { gameId },
    });

    if (resultExist) {
      await prisma.results.update({
        where: { gameId },
        data: {
          score1: result.score1,
          score2: result.score2,
        },
      });
    } else {
      await prisma.results.create({
        data: {
          gameId,
          score1: result.score1,
          score2: result.score2,
        },
      });
    }
  }
}

module.exports = AdminRepository;
