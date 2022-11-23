"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createDummyFile = exports.getGame = void 0;
var axios = require("axios");
var fs = require("fs");
var getResult = function (game) {
    return game[6].split(", ");
};
var sortableDate = function (date) {
    var _a = date.split("/"), month = _a[0], day = _a[1], year = _a[2];
    return Number("".concat(year).concat(month).concat(day));
};
var getGame = function (team) { return __awaiter(void 0, void 0, void 0, function () {
    var clues, tournamentsResponse, tournaments, tournamentYears, lastTournamentYear, teamCompletedGamesResponse, teamCompletedGames, nonconWins, winsList, lastGame, _a, result, score, allPlayersResponse, highestUsagePlayer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                clues = [];
                return [4 /*yield*/, axios.get("https://barttorvik.com/all_ncaa.json")];
            case 1:
                tournamentsResponse = _b.sent();
                tournaments = tournamentsResponse.data;
                tournamentYears = Object.keys(tournaments).sort(function (a, b) { return Number(b) - Number(a); });
                lastTournamentYear = tournamentYears.find(function (year) { return tournaments[year][team]; });
                if (lastTournamentYear) {
                    clues.push("They last appeared in the NCAA tournament in ".concat(lastTournamentYear, " as a ").concat(tournaments[lastTournamentYear][team], " seed."));
                }
                else {
                    clues.push("We've gone back as far as 2008 and could not find an NCAA tournament that included this team.");
                }
                return [4 /*yield*/, axios.get("https://barttorvik.com/getgamestats.php?year=2023&tvalue=".concat(team))];
            case 2:
                teamCompletedGamesResponse = _b.sent();
                teamCompletedGames = teamCompletedGamesResponse.data.sort(function (a, b) { return sortableDate(a[0]) - sortableDate(b[0]); });
                nonconWins = teamCompletedGames.reduce(function (result, game) {
                    if (getResult(game)[0] === "W") {
                        result.push(game[4]);
                    }
                    return result;
                }, []);
                if (nonconWins.length) {
                    winsList = void 0;
                    if (nonconWins.length === 1) {
                        winsList = nonconWins[0];
                    }
                    else if (nonconWins.length === 2) {
                        winsList = nonconWins.join(" and ");
                    }
                    else {
                        nonconWins[nonconWins.length - 1] = "and ".concat(nonconWins[nonconWins.length - 1]);
                        winsList = nonconWins.join(", ");
                    }
                    clues.push("In non-conference play, they have beaten ".concat(winsList, "."));
                }
                else {
                    clues.push("They zero non-conference wins.");
                }
                lastGame = teamCompletedGames[teamCompletedGames.length - 1];
                _a = getResult(lastGame), result = _a[0], score = _a[1];
                clues.push("Last time out, they ".concat(result === "W" ? "beat" : "lost to", " ").concat(lastGame[4], ", ").concat(score, "."));
                clues.push("They play in the ".concat(lastGame[3], "."));
                return [4 /*yield*/, axios.get("https://barttorvik.com/getadvstats.php?year=2023&specialSource=0&conyes=0&start=20221101&end=20230501&top=363&xvalue=undefined&page=playerstat&team=")];
            case 3:
                allPlayersResponse = _b.sent();
                highestUsagePlayer = allPlayersResponse.data
                    .filter(function (playerInfo) { return playerInfo[1] === team && playerInfo[4] > 50; })
                    .sort(function (a, b) { return b[6] - a[6]; })[0];
                if (highestUsagePlayer) {
                    clues.push("".concat(highestUsagePlayer[0], " leads the team with a ").concat(highestUsagePlayer[6], "% usage rate."));
                }
                clues.push("They are coached by ".concat(lastGame[25], "."));
                return [2 /*return*/, { clues: clues, answer: team }];
        }
    });
}); };
exports.getGame = getGame;
var createDummyFile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var games;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all([
                    (0, exports.getGame)("Duke"),
                    (0, exports.getGame)("Kentucky"),
                    (0, exports.getGame)("Gonzaga"),
                    (0, exports.getGame)("Texas"),
                    (0, exports.getGame)("Manhattan"),
                    (0, exports.getGame)("Binghamton"),
                ])];
            case 1:
                games = _a.sent();
                fs.writeFileSync("app/data/dummy.json", JSON.stringify({ games: games }, undefined, 2));
                return [2 /*return*/];
        }
    });
}); };
exports.createDummyFile = createDummyFile;
(0, exports.createDummyFile)();
