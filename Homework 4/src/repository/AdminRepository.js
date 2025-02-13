const GuestRepository = require("./GuestRepository");
const client = require('../../config/dbconfig')
const QueryBuilder = require("../utils/QueryBuilder");
const queryBuilder = new QueryBuilder();

class AdminRepository extends GuestRepository {

    getGameByID(id) {
        return new Promise((resolve, reject) => {
            const query = queryBuilder.getGameBy('id', id)
            client.query(query, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data.rows[0]);
            });
        })
    }

    deleteResult(gameId) {
        return new Promise((resolve, reject) => {
            client.query(`DELETE FROM results WHERE gameId=${gameId}`, (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            })
        })
    }

    deleteGameById(id) {
        return new Promise((resolve, reject) => {
            client.query(`DELETE FROM games WHERE id=${id}`, (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            })
        })
    }

    async deleteGame(id) {
        await this.deleteResult(id);
        await this.deleteGameById(id);
    }

    getTeams() {
        return new Promise((resolve, reject) => {
            const query = queryBuilder.getTeamBy();
            client.query(query, (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data.rows);
            });
        })
    }

    async addGame(body) {
        const {team1Name, team2Name, date} = body;

        if (team1Name === team2Name) {
            return;
        }

        const query = queryBuilder.addGame(team1Name, team2Name, date);
        client.query(query, (err, _) => {
            if (err) {
                console.log(err)
            }
        })
    }

    async updateGame(values) {
        const { updatedGame, updatedResult } = values;

        try {
            await client.query('BEGIN');

            if (updatedGame?.team1 && updatedGame?.team2) {
                const queryUpdateGame = queryBuilder.updateGame(updatedGame);
                await client.query(queryUpdateGame);
            }

            if (updatedResult?.score1 && updatedResult?.score2) {
                await this.updateGameResult(updatedGame.id, updatedResult);
            }

            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Failed to update game: ${error.message}`);
        }
    }

    async updateGameResult(gameId, result) {
        const { rows } = await client.query(
            queryBuilder.checkIsResultExist(gameId)
        );

        const query = rows.length > 0
            ? queryBuilder.updateResult(gameId, result)
            : queryBuilder.addResult(gameId, result);

        await client.query(query);
    }
}

module.exports = AdminRepository;
