function deleteGame(id) {
  const config = {
    method: "DELETE",
  };
  fetch(`http://localhost:3000/admin/deleteGame/${id}`, config)
      .then(() => {
        const list = document.querySelector('.schedule');
        const listElement = document.getElementById(`${id}`);
        list.removeChild(listElement);
      })
      .catch((err) => {
        console.log(err);
      });
}


