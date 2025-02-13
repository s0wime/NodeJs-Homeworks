const client = require('../../config/dbconfig')
const QueryBuilder = require("../utils/QueryBuilder");
const queryBuilder = new QueryBuilder();

class GuestRepository {

  getGames() {
    return new Promise((resolve, reject) => {
      const query = queryBuilder.getGameBy();

      client.query(query, (err, res) => {
        if (err) reject(err);

        resolve(res.rows);
      })
    })
  }

  getGamesByTeamName(name) {
    return new Promise((resolve, reject) => {
      const query = queryBuilder.getGameBy('teamName', name);

      client.query(query, (err, res) => {
        if (err) {
          reject();
        }

        if(!res.rows[0]?.id) {
          resolve(null)
        }

        resolve(res.rows);
      })
    })
  }
}

module.exports = GuestRepository;
