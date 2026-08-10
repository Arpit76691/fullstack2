// Dummy user database
// 5 Admins, 10 Editors, 15 Viewers
// All passwords follow the same pattern per role:
//   admin -> admin123
//   editor -> editor123
//   viewer -> viewer123

const users = [
  // ----- Admins (5) -----
  { id: 1, username: "admin1", password: "admin123", email: "admin1@example.com", role: "admin" },
  { id: 2, username: "admin2", password: "admin123", email: "admin2@example.com", role: "admin" },
  { id: 3, username: "admin3", password: "admin123", email: "admin3@example.com", role: "admin" },
  { id: 4, username: "admin4", password: "admin123", email: "admin4@example.com", role: "admin" },
  { id: 5, username: "admin5", password: "admin123", email: "admin5@example.com", role: "admin" },

  // ----- Editors (10) -----
  { id: 6, username: "editor1", password: "editor123", email: "editor1@example.com", role: "editor" },
  { id: 7, username: "editor2", password: "editor123", email: "editor2@example.com", role: "editor" },
  { id: 8, username: "editor3", password: "editor123", email: "editor3@example.com", role: "editor" },
  { id: 9, username: "editor4", password: "editor123", email: "editor4@example.com", role: "editor" },
  { id: 10, username: "editor5", password: "editor123", email: "editor5@example.com", role: "editor" },
  { id: 11, username: "editor6", password: "editor123", email: "editor6@example.com", role: "editor" },
  { id: 12, username: "editor7", password: "editor123", email: "editor7@example.com", role: "editor" },
  { id: 13, username: "editor8", password: "editor123", email: "editor8@example.com", role: "editor" },
  { id: 14, username: "editor9", password: "editor123", email: "editor9@example.com", role: "editor" },
  { id: 15, username: "editor10", password: "editor123", email: "editor10@example.com", role: "editor" },

  // ----- Viewers (15) -----
  { id: 16, username: "viewer1", password: "viewer123", email: "viewer1@example.com", role: "viewer" },
  { id: 17, username: "viewer2", password: "viewer123", email: "viewer2@example.com", role: "viewer" },
  { id: 18, username: "viewer3", password: "viewer123", email: "viewer3@example.com", role: "viewer" },
  { id: 19, username: "viewer4", password: "viewer123", email: "viewer4@example.com", role: "viewer" },
  { id: 20, username: "viewer5", password: "viewer123", email: "viewer5@example.com", role: "viewer" },
  { id: 21, username: "viewer6", password: "viewer123", email: "viewer6@example.com", role: "viewer" },
  { id: 22, username: "viewer7", password: "viewer123", email: "viewer7@example.com", role: "viewer" },
  { id: 23, username: "viewer8", password: "viewer123", email: "viewer8@example.com", role: "viewer" },
  { id: 24, username: "viewer9", password: "viewer123", email: "viewer9@example.com", role: "viewer" },
  { id: 25, username: "viewer10", password: "viewer123", email: "viewer10@example.com", role: "viewer" },
  { id: 26, username: "viewer11", password: "viewer123", email: "viewer11@example.com", role: "viewer" },
  { id: 27, username: "viewer12", password: "viewer123", email: "viewer12@example.com", role: "viewer" },
  { id: 28, username: "viewer13", password: "viewer123", email: "viewer13@example.com", role: "viewer" },
  { id: 29, username: "viewer14", password: "viewer123", email: "viewer14@example.com", role: "viewer" },
  { id: 30, username: "viewer15", password: "viewer123", email: "viewer15@example.com", role: "viewer" },
];

export default users;
