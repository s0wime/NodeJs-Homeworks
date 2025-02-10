const elSelectTeam1 = document.getElementById("team1");
const elSelectTeam2 = document.getElementById("team2");
const dateInput = document.getElementById("date");
// const YEARS_LIMIT = 3;

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
  fillSelect(elSelectTeam2, elSelectTeam1.value);
  fillSelect(elSelectTeam1, elSelectTeam2.value);
}

elSelectTeam1.addEventListener("change", () => {
  fillSelect(elSelectTeam2, elSelectTeam1.value);
});

elSelectTeam2.addEventListener("change", () => {
  fillSelect(elSelectTeam1, elSelectTeam2.value);
});

initSelects();

const now = new Date();
const yearsLater = new Date();
yearsLater.setFullYear(now.getFullYear() + 3);

function convertDateToString(date) {
  return date.toISOString().slice(0, 16);
}

dateInput.min = convertDateToString(now);
dateInput.max = convertDateToString(yearsLater);
