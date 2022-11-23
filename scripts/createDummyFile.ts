const axios = require("axios");
const fs = require("fs");

const getResult = (game: Array<any>) => {
  return game[6].split(", ");
};

const sortableDate = (date: string) => {
  const [month, day, year] = date.split("/");
  return Number(`${year}${month}${day}`);
};

export const getGame = async (team: string) => {
  const clues = [];

  const tournamentsResponse = await axios.get(
    "https://barttorvik.com/all_ncaa.json"
  );
  const tournaments = tournamentsResponse.data;
  const tournamentYears = Object.keys(tournaments).sort(
    (a, b) => Number(b) - Number(a)
  );
  const lastTournamentYear = tournamentYears.find(
    (year) => tournaments[year][team]
  );
  if (lastTournamentYear) {
    clues.push(
      `They last appeared in the NCAA tournament in ${lastTournamentYear} as a ${tournaments[lastTournamentYear][team]} seed.`
    );
  } else {
    clues.push(
      "We've gone back as far as 2008 and could not find an NCAA tournament that included this team."
    );
  }

  const teamCompletedGamesResponse = await axios.get(
    `https://barttorvik.com/getgamestats.php?year=2023&tvalue=${team}`
  );
  const teamCompletedGames = teamCompletedGamesResponse.data.sort(
    (a: Array<any>, b: Array<any>) => sortableDate(a[0]) - sortableDate(b[0])
  );
  const nonconWins = teamCompletedGames.reduce(
    (result: Array<string>, game: Array<any>) => {
      if (getResult(game)[0] === "W") {
        result.push(game[4]);
      }
      return result;
    },
    []
  );

  if (nonconWins.length) {
    let winsList;
    if (nonconWins.length === 1) {
      winsList = nonconWins[0];
    } else if (nonconWins.length === 2) {
      winsList = nonconWins.join(" and ");
    } else {
      nonconWins[nonconWins.length - 1] = `and ${
        nonconWins[nonconWins.length - 1]
      }`;
      winsList = nonconWins.join(", ");
    }
    clues.push(`In non-conference play, they have beaten ${winsList}.`);
  } else {
    clues.push("They zero non-conference wins.");
  }

  const lastGame = teamCompletedGames[teamCompletedGames.length - 1];
  const [result, score] = getResult(lastGame);
  clues.push(
    `Last time out, they ${result === "W" ? "beat" : "lost to"} ${
      lastGame[4]
    }, ${score}.`
  );
  clues.push(`They play in the ${lastGame[3]}.`);

  const allPlayersResponse = await axios.get(
    "https://barttorvik.com/getadvstats.php?year=2023&specialSource=0&conyes=0&start=20221101&end=20230501&top=363&xvalue=undefined&page=playerstat&team="
  );
  const highestUsagePlayer = allPlayersResponse.data
    .filter(
      (playerInfo: Array<any>) => playerInfo[1] === team && playerInfo[4] > 50
    )
    .sort((a: Array<any>, b: Array<any>) => b[6] - a[6])[0];

  if (highestUsagePlayer) {
    clues.push(
      `${highestUsagePlayer[0]} leads the team with a ${highestUsagePlayer[6]}% usage rate.`
    );
  }

  clues.push(`They are coached by ${lastGame[25]}.`);

  return { clues, answer: team };
};

export const createDummyFile = async () => {
  const games = await Promise.all([
    getGame("Duke"),
    getGame("Kentucky"),
    getGame("Gonzaga"),
    getGame("Texas"),
    getGame("Manhattan"),
    getGame("Binghamton"),
  ]);
  fs.writeFileSync(
    "app/data/dummy.json",
    JSON.stringify({ games }, undefined, 2)
  );
};
createDummyFile();
