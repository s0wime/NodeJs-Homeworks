const btnFilter = document.querySelector(".btn--game-filter");
const elFormFilter = document.querySelector(".form-game-filter");
const elFormSearch = document.querySelector(".form-game-finder");

const optionDateSortDesc = document.getElementById("date-desc");
const optionDateSortAsc = document.getElementById("date-asc");

const optionAllGames = document.getElementById("all-games");
const optionUpcomingGames = document.getElementById("upcoming-games");
const optionCompletedGames = document.getElementById("completed-games");

const inputGameFinder = document.querySelector(".game-finder");

const btnsToPage = document.querySelectorAll(".btn--to-page");
const btnPrevPage = document.querySelector(".btn--prev-page");
const btnNextPage = document.querySelector(".btn--next-page");

const url = new URL(window.location);

function deleteGame(id) {
  const config = {
    method: "DELETE",
  };
  fetch(`http://localhost:3000/admin/games/${id}/delete`, config)
    .then(() => {
      const list = document.querySelector(".schedule");
      const listElement = document.getElementById(`${id}`);
      list.removeChild(listElement);
    })
    .catch((err) => {
      console.log(err);
    });
}

function fillFilterOptions() {
  const dateSortValue = url.searchParams.get("dateSort") || "";
  const gameStatusValue = url.searchParams.get("gameStatus") || "";

  if (dateSortValue) {
    [optionDateSortAsc, optionDateSortDesc].map((option) =>
      option.value === dateSortValue ? (option.checked = true) : ""
    );
  }

  if (gameStatusValue) {
    [optionAllGames, optionUpcomingGames, optionCompletedGames].map((option) =>
      option.value === gameStatusValue ? (option.checked = true) : ""
    );
  }
}

fillFilterOptions();

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

  window.location.href = url.toString();
});

btnsToPage.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!url.searchParams.has("page")) {
      url.searchParams.append("page", btn.textContent);
    } else {
      url.searchParams.set("page", btn.textContent);
    }

    window.location.href = url.toString();
  });
});

btnPrevPage.addEventListener("click", (e) => {
  e.preventDefault();

  if (!url.searchParams.has("page")) {
    return;
  } else if (parseInt(url.searchParams.get("page")) === 1) {
    return;
  }

  url.searchParams.set("page", parseInt(url.searchParams.get("page")) - 1);
  window.location.href = url.toString();
});

btnNextPage.addEventListener("click", (e) => {
  e.preventDefault();

  if (parseInt(url.searchParams.get("page")) >= totalPages) {
    return;
  }

  if (!url.searchParams.has("page")) {
    url.searchParams.append("page", 2);
  } else {
    url.searchParams.set("page", parseInt(url.searchParams.get("page")) + 1);
  }

  window.location.href = url.toString();
});
