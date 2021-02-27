import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <style>
        #chat-screen {
            display: flex;
            height: 100vh;
        }

        #aside-left {
            width: 30%;
            height: 100vh;
            background-color: #F0F0F0;
        }

        chat-container {
            display: block;
            width: 70%;
        }
    </style>

    <div id="chat-screen">
        <div id="aside-left">
            <app-stat></app-stat>
            <user-status status="free"></user-status>
        </div>

        <chat-container></chat-container>
    </div>
`;

export default class ChatScreen extends HTMLElement {
    currentUser = null;
    currentConversation = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$appStat = this.shadowRoot.querySelector('app-stat');
        this.$userStatus = this.shadowRoot.querySelector('user-status');
        this.$chatContainer = this.shadowRoot.querySelector('chat-container');

    }

    connectedCallback() {
        this.loadData();

        this.$userStatus.onFlirt = this.flirt.bind(this);
        this.$userStatus.onBite = this.bite.bind(this);
        this.$userStatus.onStopFlirting = this.stopFlirting.bind(this);
        this.$userStatus.onEndConversation = this.endConversation.bind(this);

    }

    async loadData() {
        await this.listenCurrentUser();
        await this.listenCurrentConversation();
    }

    async listenCurrentUser() {
        this.currentUser = await User.auth();

        this.$chatContainer.userId = this.currentUser.id;

        this.currentUser.onSnapshot(({ status }) => {
            this.$userStatus.status = status;
            if (status == 'chatting') this.listenCurrentConversation();
        });
    }

    async listenCurrentConversation() {
        Conversation.onSnapshot([
            ['users', 'array-contains', this.currentUser.id],
            ['status', '==', 'pending']
        ], (conversations) => {
            if(conversations.length == 0) {
                this.$chatContainer.conversationId = '';
                return;
            }
            this.currentConversation = conversations[0];
            this.$chatContainer.conversationId = this.currentConversation.id;
        });
    }

    async flirt() {
        this.currentUser.update({
            status: 'flirting'
        });
    }

    async bite() {
        let flirtingUsers = await User.where([
            ['status', '==', 'flirting']
        ]);

        if (flirtingUsers.length == 0) {
            alert("There is no flirting users");
        } else {
            let random = Math.floor(Math.random() * flirtingUsers.length);
            await this.startConversation(flirtingUsers[random]);
        }
    }

    async stopFlirting() {
        this.currentUser.update({
            status: 'free'
        });
    }

    /**
     * Create new conversation with other user
     * @param {User} otherUser 
     */
    async startConversation(otherUser) {
        await Conversation.create({
            users: [
                this.currentUser.id,
                otherUser.id
            ],
            status: 'pending',
            dateModified: new Date().toISOString()
        });

        await this.currentUser.update({ status: 'chatting' });
        await otherUser.update({ status: 'chatting' });
    }

    /**
     * Stop current conversation
     */
    async endConversation() {
        await this.currentConversation.update({
            status: 'ended'
        });

        for (let userId of this.currentConversation.users) {
            let user = await User.find(userId);
            await user.update({ status: 'free' });
        }

        this.$chatContainer.conversationId = '';

    }
}