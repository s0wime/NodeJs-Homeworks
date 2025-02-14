const btnFilter = document.querySelector(".btn--game-filter");
const elFilterBlock = document.querySelector(".filter-block");
const elFilterByDate = document.querySelector(".filter-by-date");
const elFilterByStatus = document.querySelector(".filter-by-status");

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

function handleFieldsetChanging(event) {}

btnFilter.addEventListener("click", () => {
  elFilterBlock.classList.toggle("hidden");
});

elFilterByDate.addEventListener("change", (e) => {
  handleFieldsetChanging(e);
});

elFilterByStatus.addEventListener("change", (e) => {
  handleFieldsetChanging(e);
});
