const fsPromises = require("node:fs").promises;
const path = require("node:path");
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
        await this.deleteGameById("games", id);
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

    getTeamByName(name) {
        return new Promise((resolve, reject) => {
            client.query(`SELECT * FROM teams WHERE name=${name}`, (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
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

    addResult(gameId, result) {
        results.push({
            id: results[results.length - 1]?.id + 1 || 1,
            game_id: gameId,
            score1: result.score1,
            score2: result.score2,
        });
    }

    async updateGame(values) {
        const {updatedGame, updatedResult} = values;

        await client.query('BEGIN')
        try {
            if (updatedResult.score1 && updatedResult.score1 && updatedGame.team1 && updatedGame.team2) {
                const queryUpdateGame = queryBuilder.updateGame(updatedGame);
                await client.query(queryUpdateGame)

                const queryUpdateResult = queryBuilder.updateResult(updatedGame.id, updatedResult);
                await client.query(queryUpdateResult)

                client.query('COMMIT')
                return true

            } else if (updatedResult.score1 && updatedResult.score2) {
                const queryUpdateResult = queryBuilder.updateResult(updatedGame.id, updatedResult);
                await client.query(queryUpdateResult)
                client.query('COMMIT')
                return true
            } else if (updatedGame.team1 && updatedGame.team2) {
                const queryUpdateGame = queryBuilder.updateGame(updatedGame);
                await client.query(queryUpdateGame)
                client.query('COMMIT')
                return true
            } else {
                return false;
            }
        } catch (e) {
            client.query('ROLLBACK')
        }
    }
}

module.exports = AdminRepository;
