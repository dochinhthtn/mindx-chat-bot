import Model from './Model.js';
import { md5 } from '../utils.js';

export default class User extends Model {
    static collection = 'users';
    static hiddenFields = ['password', 'token'];

    /**
     * @type {User}
     * @property {User|null} currentUser
     */
    static currentUser = null;

    name;
    email;
    password;
    status;

    static makeToken(id) {
        return md5(id + Date.now()).toString();
    }

    static async findByEmail(email) {
        let users = await User.where([
            ['email', '==', email]
        ]);

        if(users.length == 0) return null;
        
        return users[0];
    }

    static async signIn(credential) {
        let users = await User.where([
            ['email', '==', credential.email],
            ['password', '==', md5(credential.password)]
        ]);

        if (users.length == 0) {
            throw new Error("Email or password is incorrect!");
        }

        let currentUser = users[0];
        let token = this.makeToken(currentUser.id);
        localStorage.setItem('token', token);

        currentUser.update({
            token: token
        });

        this.currentUser = currentUser;
        return currentUser;
    }

    /**
     * Create a new use with credential
     * @param { {name: '', password: '', email: ''} } credential 
     */
    static async signUp(credential) {
        let docs = await User.where([
            ['email', '==', credential.email]
        ]);

        if (docs.length == 0) {
            credential.password = md5(credential.password);
            credential.status = 'free';
            
            let newUser = await User.create(credential);
            return newUser;
        } else {
            throw new Error('Your email has already used by another account!');
        }
    }

    /**
     * Check if have current user, if not return null
     * 
     */
    static async auth() {
        if (this.currentUser != null) {
            return this.currentUser;
        }

        let token = localStorage.getItem('token');
        if (!token) {
            return null;
        }

        let users = await User.where([
            ['token', '==', token]
        ]);

        if (users.length == 0) {
            return null;
        }

        this.currentUser = users[0];
        return this.currentUser;
    }

    /**
     * Get all conversations of user
     * @returns {Array<Conversation>}
     */
    async activeConversations() {
        return await Conversation.where([
            ['users', 'array-contains', this.id],
            ['status', '==', 'pending']
        ]);
    }
}