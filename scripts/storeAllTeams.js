const axios = require("axios");
const fs = require("fs");

const storeAllTeams = async () => {
  const response = await axios.get("https://barttorvik.com/get-tsdict.php");
  const content = {
    teams: Object.keys(response.data["2023"]),
  };
  fs.writeFileSync("./app/data/teams.json", JSON.stringify(content));
};

storeAllTeams();
