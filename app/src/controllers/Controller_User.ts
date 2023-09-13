import { Elysia } from "elysia";
import UserService from '../services/Service_User';
const app = new Elysia();

class UserController {
    public path = '/api/v1/user';
    public router = app.routes;

    private userService: UserService; 

    constructor(/*private userService: UserService -- if you had Dependecy Injection*/) {
        this.intializeRoutes();
        this.userService = new UserService();
    }

    public intializeRoutes() {
        app.get('/id/:id', ({ params: { id } }) => this.getUserByID(id));
        app.get(this.path, () => this.getAllUsers);
        app.post(this.path, ({params: user }) => this.createUser(user));
        app.delete(this.path, ({params: id}) => this.deleteUser(id));
    }

    getUserByID = (data: any) => {     
        if (!data.params.id) return `No ID Provided`
        const user = this.userService.getUserByID(parseInt(data.params.id));
        if (!user) return `User Not Found With that ID`
        return user;
    }
    getAllUsers = () => {
        const users = this.userService.getAllUsers();
        if (!users || users.length === 0) return `No Users Found`
        return users;
    }

    createUser = (user: any) => {
        if (!user) return `No User Object Provided`
        const result = this.userService.addUser(user);
        if (!result) return `An Error Occured While Adding User`
        else return `User with ID ${result.id} added successfully`
    }

    deleteUser = (data: any) => {
        if (!data.params.id) return `No ID Provided`
        const user = this.userService.getUserByID(parseInt(data.params.id));
        if (!user) return `User Not Found With that ID`
        const result = this.userService.deleteUserByID(data.params.id);
        if (!result) return `An Error Occured While Deleting User`
        else return `User with ID ${result.id} deleted successfully`
    }
}

export default UserController;


/* API Endpoints:
    - GET /api/v1/user
    - GET /api/v1/user/:id
    - POST /api/v1/user, body { UserModel }
    - DELETE /api/v1/user, body { ID: Number }
*/