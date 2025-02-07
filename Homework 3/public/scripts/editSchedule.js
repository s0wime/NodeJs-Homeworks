const btnsDeleteGame = document.querySelectorAll(".btn--delete-game");

function deleteGame(id) {
  const config = {
    method: "DELETE",
  };
  fetch(`/admin/deleteGame/?gameId=${id}`, config);
}

btnsDeleteGame.forEach((button) => {
  button.addEventListener("click", (event) => {
    const clickedButton = event.currentTarget;
    const gameId = clickedButton.dataset.gameId;
    console.log("Натиснута кнопка з gameId:", gameId);

    deleteGame(gameId);
  });
});
