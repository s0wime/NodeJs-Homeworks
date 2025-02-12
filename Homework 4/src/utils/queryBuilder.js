
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
    }
}

module.exports = QueryBuilder;