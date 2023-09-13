import UserRepository from '../repositories/Repository_User';

class UserService {
    private userRepository: UserRepository; 
    
    private users: any[] = [];

    constructor(/*private userRepository: UserRepository -- if you had Dependecy Injection*/) {
        this.userRepository = new UserRepository();
        this.users = this.userRepository.getAllUsers(); // keep local version
    }

    private updateUsers() {
        this.users = this.userRepository.getAllUsers(); // update local users copy
    }

    public getAllUsers() {
        return this.users;
    }

    public getUserByID(userid: Number) {
        return this.users.find(u => u.id == userid);
    }

    public addUser(user: any) {
        const addedUserObj = this.userRepository.addUser(user);
        this.updateUsers();
        return addedUserObj;
    }

    public deleteUserByID(userid: Number) {
        const user = this.getUserByID(userid);
        const deletedUserObj = this.userRepository.deleteUser(user);
        this.updateUsers();
        return deletedUserObj;
    }

}
export default UserService;