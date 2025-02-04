const users = [
  {
    id: 1,
    name: "Vitalii",
    interests: ["gym", "chess", "pepsi"],
  },
  {
    id: 2,
    name: "Danil",
    interests: ["ai prompt creator", "coca-cola", "crabsburger"],
  },
  {
    id: 3,
    name: "Nikitos4443",
    interests: ["fanta", "football", "tennis"],
  },
  {
    id: 4,
    name: "Dava",
    interests: ["sprite", "boba messi", "big mac"],
  },
];

const getUser = (id) => {
  id = parseInt(id);
  return users.find((user) => user.id === id);
};

module.exports = { users, getUser };
