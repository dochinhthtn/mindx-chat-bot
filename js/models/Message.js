import Conversation from "./Conversation.js";
import Model from "./Model.js";
import User from "./User.js";

export default class Message extends Model {
    static collection = 'messages';
    content;
    userId;
    conversationId;
    dateModified;

    async user() {
        return await User.find(this.userId);
    }

    async conversation() {
        return await Conversation.find(this.conversationId);
    }
}