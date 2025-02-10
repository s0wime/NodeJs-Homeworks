const elSelectTeam1 = document.getElementById("team1Name");
const elSelectTeam2 = document.getElementById("team2Name");
const team1ScoreInput = document.getElementById("team1Score");
const team2ScoreInput = document.getElementById("team2Score");
const dateInput = document.getElementById("date");
const elForm = document.querySelector(".form");

function fillSelect(select, exclude = null) {
  const currentOption = select.value;
  select.innerHTML = "";

  teams.forEach((team) => {
    if (team.name !== exclude) {
      const option = document.createElement("option");
      option.value = team.name;
      option.textContent = team.name;
      select.appendChild(option);
    }
  });

  if ([...select.options].some((option) => option.value === currentOption)) {
    select.value = currentOption;
  }
}

function initSelects() {
  fillSelect(elSelectTeam1);
  fillSelect(elSelectTeam2);
  elSelectTeam1.value = teams.find((team) => team.id === game.team1_id).name;
  elSelectTeam2.value = teams.find((team) => team.id === game.team2_id).name;
}

function initScores() {
  if (!result) {
    return;
  }

  team1ScoreInput.value = result.score1;
  team2ScoreInput.value = result.score2;
}

function initDate() {
  dateInput.value = game.date;
}

elSelectTeam1.addEventListener("change", () => {
  fillSelect(elSelectTeam2, elSelectTeam1.value);
});

elSelectTeam2.addEventListener("change", () => {
  fillSelect(elSelectTeam1, elSelectTeam2.value);
});

initSelects();
initScores();
initDate();

const now = new Date();
const yearsLater = new Date();
yearsLater.setFullYear(now.getFullYear() + 3);

function convertDateToString(date) {
  return date.toISOString().slice(0, 16);
}

dateInput.min = convertDateToString(now);
dateInput.max = convertDateToString(yearsLater);

elForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  data.team1Score = parseInt(data.team1Score);
  data.team2Score = parseInt(data.team2Score);

  const options = {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };

  fetch("http://localhost:3000/admin/editGame/", options);
});
