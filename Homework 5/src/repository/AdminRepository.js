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
      await client.query("BEGIN");

      if (updatedGame?.team1 && updatedGame?.team2) {
        const queryUpdateGame = queryBuilder.updateGame(updatedGame);
        await client.query(queryUpdateGame);
      }

      if (updatedResult?.score1 && updatedResult?.score2) {
        await this.updateGameResult(updatedGame.id, updatedResult);
      }

      await client.query("COMMIT");
      return true;
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`Failed to update game: ${error.message}`);
    }
  }

  async updateGameResult(gameId, result) {
    const { rows } = await client.query(
      queryBuilder.checkIsResultExist(gameId)
    );

    const query =
      rows.length > 0
        ? queryBuilder.updateResult(gameId, result)
        : queryBuilder.addResult(gameId, result);

    await client.query(query);
  }
}

module.exports = AdminRepository;
