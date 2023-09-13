class UserRepository {
    private users: any[] = [ { id: 1 } ];

    constructor() {
    }

    public getAllUsers() {
        return this.users;
    }

    public addUser(user: any) {
        this.users.push(user);
        return user;
    }

    public deleteUser(user: any) {
        this.users = this.users.filter(u => u.id != user.id);
        return user;
    }

}
export default UserRepository;