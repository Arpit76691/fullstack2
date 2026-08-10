// Users page — admin only
// Lists all 30 users from the dummy database.

import users from "../../data/users";

const RoleBadge = ({ role }) => (
  <span className={`badge badge-${role}`}>{role}</span>
);

const Users = () => {
  return (
    <div className="page">
      <h2 className="page-title">Users</h2>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <RoleBadge role={u.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;