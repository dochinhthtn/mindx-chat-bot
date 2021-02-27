import Message from "../models/Message.js";
import User from "../models/User.js";

const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <style>
        message-list {
            display: block;
            height: calc(100vh - 50px);
            overflow-y: scroll;
        }

        send-message-form {
            display: block;
        }
    </style>
    <div id="chat-container">
        <message-list></message-list>
        <send-message-form></send-message-form>
    </div>
`;

export default class ChatContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$messageList = this.shadowRoot.querySelector('message-list');
        this.$sendMessageForm = this.shadowRoot.querySelector('send-message-form');
    }

    static get observedAttributes() {
        return ['conversation-id', 'user-id'];
    }

    connectedCallback() {
        this.$sendMessageForm.onSendMessage = this.sendMessage.bind(this);
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName == 'conversation-id') {
            if (newValue != '') this.listenMessagesUpdate();
            else {
                this.showMessages([{
                    content: 'Conversation was not found or just ended',
                    userId: this.userId
                }])
            }
        } 
    }

    listenMessagesUpdate() {
        Message.onSnapshot([
            ['conversationId', '==', this.conversationId]
        ], (messages) => {
            this.showMessages(messages);
        });
    }

    showMessages(messages) {
        messages.sort((a, b) => new Date(a.dateModified) - new Date(b.dateModified));

        this.$messageList.messages = messages.map(message => {
            message.owned = this.userId == message.userId;
            return message;
        });
    }

    async sendMessage(message) {
        if(!this.conversationId || !this.userId) return;

        message.userId = this.userId;
        message.conversationId = this.conversationId;
        message.dateModified = new Date().toISOString();

        await Message.create(message);
    }

    get conversationId() {
        return this.getAttribute('conversation-id');
    }

    set conversationId(value) {
        this.setAttribute('conversation-id', value);
    }

    get userId() {
        return this.getAttribute('user-id');
    }

    set userId(value) {
        this.setAttribute('user-id', value);
    }

}