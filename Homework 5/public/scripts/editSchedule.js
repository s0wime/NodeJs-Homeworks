const btnFilter = document.querySelector(".btn--game-filter");
const elFormFilter = document.querySelector(".form-game-filter");
const elFormSearch = document.querySelector(".form-game-finder");

const optionDateSortDesc = document.getElementById("date-desc");
const optionDateSortAsc = document.getElementById("date-asc");

const optionAllGames = document.getElementById("all-games");
const optionUpcomingGames = document.getElementById("upcoming-games");
const optionCompletedGames = document.getElementById("completed-games");

const inputGameFinder = document.querySelector(".game-finder");

const url = new URL(window.location);

function deleteGame(id) {
  const config = {
    method: "DELETE",
  };
  fetch(`http://localhost:3000/admin/deleteGame/${id}`, config)
    .then(() => {
      const list = document.querySelector(".schedule");
      const listElement = document.getElementById(`${id}`);
      list.removeChild(listElement);
    })
    .catch((err) => {
      console.log(err);
    });
}

btnFilter.addEventListener("click", () => {
  elFormFilter.classList.toggle("hidden");
});

elFormFilter.addEventListener("submit", (e) => {
  e.preventDefault();
  const dateSortValue = [optionDateSortAsc, optionDateSortDesc].find(
    (option) => option.checked
  ).value;
  const gameStatusValue = [
    optionAllGames,
    optionUpcomingGames,
    optionCompletedGames,
  ].find((option) => option.checked).value;

  if (!url.searchParams.has("dateSort")) {
    url.searchParams.append("dateSort", dateSortValue);
  } else {
    url.searchParams.set("dateSort", dateSortValue);
  }

  if (!url.searchParams.has("gameStatus")) {
    url.searchParams.append("gameStatus", gameStatusValue);
  } else {
    url.searchParams.set("gameStatus", gameStatusValue);
  }

  window.location.href = url.toString();
});

elFormSearch.addEventListener("submit", (e) => {
  e.preventDefault();

  const teamName = inputGameFinder.value;

  if (!teamName) {
    return;
  }

  if (!url.searchParams.has("teamName")) {
    url.searchParams.append("teamName", teamName);
  } else {
    url.searchParams.set("teamName", teamName);
  }

  console.log(url.toString());

  window.location.href = url.toString();
});
