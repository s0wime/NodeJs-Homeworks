const users = [
  {
    id: 1,
    name: "Vitalii",
    interests: ["gym", "chess", "pepsi"],
    link: "/images/image1.jpg",
  },
  {
    id: 2,
    name: "Danil",
    interests: ["ai prompt creator", "coca-cola", "crabsburger"],
    link: "/images/image2.png",
  },
  {
    id: 3,
    name: "Nikitos4443",
    interests: ["fanta", "football", "tennis"],
    link: "/images/image3.png",
  },
  {
    id: 4,
    name: "Dava",
    interests: ["sprite", "boba messi", "big mac"],
    link: "/images/image4.png",
  },
];

const getUser = (id) => {
  id = parseInt(id);
  return users.find((user) => user.id === id);
};

module.exports = { users, getUser };
