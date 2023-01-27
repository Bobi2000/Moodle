import Role from "./Role";

type User = {
    username: string;
    email: string;
    password: string;
    role: Role;
};

export default User;