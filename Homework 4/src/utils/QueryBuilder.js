class QueryBuilder {
    getGameBy(searchKey = 'default', value = null) {
        if(searchKey === 'default') {
            return "SELECT g.id, t1.name AS team1Name, t2.name AS team2Name, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') AS date, r.score1, r.score2 FROM games g\n" +
                "INNER JOIN teams t1 ON g.team1=t1.id\n" +
                "INNER JOIN teams t2 ON g.team2=t2.id\n" +
                "LEFT JOIN results r ON r.gameid=g.id;"
        }

        if(searchKey === 'teamName') {
            return "SELECT g.id, t1.name AS team1Name, t2.name AS team2Name, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') AS date, r.score1, r.score2 FROM games g\n" +
                "INNER JOIN teams t1 ON t1.id=g.team1\n" +
                "INNER JOIN teams t2 ON t2.id=g.team2\n" +
                "LEFT JOIN results r ON r.gameid=g.id\n" +
                `WHERE t1.name='${value}' OR t2.name='${value}'`
        }

        if(searchKey === 'id') {
            return "SELECT g.id, t1.name AS team1Name, t2.name AS team2Name, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') AS date, r.score1, r.score2 FROM games g\n" +
                "INNER JOIN teams t1 ON t1.id=g.team1\n" +
                "INNER JOIN teams t2 ON t2.id=g.team2\n" +
                "LEFT JOIN results r ON r.gameid=g.id\n" +
                `WHERE g.id=${value}`
        }
    }

    getTeamBy(searchKey = 'default') {
        if(searchKey === 'default') {
            return `SELECT * FROM teams`
        }

        if(searchKey === '') {}
    }

    addGame(team1, team2, date) {
        return "INSERT INTO games " +
            "VALUES (" +
            "default," +
            `(SELECT id FROM teams WHERE name='${team1}'),` +
            `(SELECT id FROM teams WHERE name='${team2}'),` +
            `'${date}')`
    }

    updateGame(props) {
        const {id, team1, team2, date} = props;

        return "UPDATE games\n" +
            "SET\n" +
            `team1=(SELECT id FROM teams WHERE name='${team1}'),
` +
            `team2=(SELECT id FROM teams WHERE name='${team2}'),
` +
            `date='${date}'
` +
            `WHERE id=${id};
`
    }

    addResult(gameId, result) {
        return 'INSERT INTO results \n' +
            `VALUES(default, ${result.score1}, ${result.score2}, ${gameId})`
    }

    updateResult(gameId, result) {
        return "UPDATE results\n" +
            "SET\n" +
            `    score1=${result.score1},
` +
            `    score2=${result.score2}
` +
            `WHERE gameid=${gameId}`
    }

    checkIsResultExist(gameId) {
        return "SELECT 1 FROM results\n" +
            `WHERE gameid = ${gameId}`
    }
}

module.exports = QueryBuilder;