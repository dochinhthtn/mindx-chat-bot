import Model from './Model.js';

export default class Conversation extends Model {
    static collection = 'conversations';

    users;
    messages = [];
    status;
    dateModified;

    async addMessage(message) {
        this.ref.update({
            messages: firebase.firestore.FieldValue.arrayUnion(message)
        });
    }
}