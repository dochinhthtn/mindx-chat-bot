import User from "../models/User.js";

const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <link rel="stylesheet" href="../../fontawesome/css/all.min.css">
    <style>
        * {
            font-family: Arial;
        }

        #app-stat {
            padding: 10px;
        }

        #app-stat > * {
            margin: 10px 0px;
            padding: 15px;
            border-radius: 3px;
            border: 1px solid #ced4da; 
            background-color: #FFFFFF;
        }

        i {
            display: block;
            width: 30px;
            text-align: center
        }
    </style>
    <div id="app-stat">
        <div title="Free users"><i class="fas fa-users"></i> <span id="free">120</span></div>
        <div title="Chatting"><i class="fas fa-comments"></i> <span id="chatting">120</span></div>
        <div title="Flirting"><i class="fas fa-heart"></i> <span id="flirting">120</span></div>
    </div>
`;

export default class AppStat extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$free = this.shadowRoot.getElementById('free');
        this.$chatting = this.shadowRoot.getElementById('chatting');
        this.$flirting = this.shadowRoot.getElementById('flirting');
    }

    static get observedAttributes() {
        return ['free', 'chatting', 'flirting'];
    }

    connectedCallback() {
        this.listenAppStat();
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if(attrName == 'free') {
            this.$free.innerHTML = newValue;
        } else if(attrName == 'chatting') {
            this.$chatting.innerHTML = newValue;
        } else if (attrName == 'flirting') {
            this.$flirting.innerHTML = newValue;
        }
    }

    listenAppStat() {
        User.onSnapshot([
            ['status', '==', 'free']
        ], (users) => {
            this.free = users.length;
        });

        User.onSnapshot([
            ['status', '==', 'flirting']
        ], (users) => {
            this.flirting = users.length;
        });

        User.onSnapshot([
            ['status', '==', 'chatting']
        ], (users) => {
            this.chatting = users.length;
        });
    }

    set free(value) {
        this.setAttribute('free', value);
    }

    get free() {
        return this.getAttribute('free');
    }

    set chatting(value) {
        this.setAttribute('chatting', value);
    }

    get chatting() {
        return this.getAttribute('chatting');
    }

    set flirting(value) {
        this.setAttribute('flirting', value);
    }

    get flirting() {
        return this.getAttribute('flirting');
    }

}