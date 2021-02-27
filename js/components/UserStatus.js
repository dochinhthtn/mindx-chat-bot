const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <style>
        #user-status {
            padding: 10px;
        }
        
        #user-status > * {
            display: block;
            width: 100%;
            height: 40px;
            margin: 10px 0px;
            outline: none;
            cursor: pointer;
            font-family: Arial;
            font-size: 18px;
            color: #FFFFFF;
            border-radius: 3px;
        }

        #flirt-btn {
            border: 1px solid #665DFE;
            background-color: #665DFE;
        }

        #bite-btn {
            border: 1px solid #1DA261;
            background-color: #1DA261;
        }

        #stop-flirting-btn {
            border: 1px solid #2E9186;
            background-color: #2E9186;
        }

        #end-conversation-btn {
            border: 1px solid #DC4D41;
            background-color: #DC4D41;
        }

        .free > #stop-flirting-btn, 
        .free > #end-conversation-btn {
            display: none;
        }

        .flirting > #flirt-btn, 
        .flirting > #bite-btn, 
        .flirting > #end-conversation-btn {
            display: none;
        } 

        .chatting > #flirt-btn, 
        .chatting > #bite-btn, 
        .chatting > #stop-flirting-btn {
            display: none;
        } 


    </style>
    <div id="user-status">
        <button id="flirt-btn">Let's flirt</button>
        <button id="bite-btn">Bite</button>
        <button id="stop-flirting-btn">Stop flirting</button>
        <button id="end-conversation-btn">End conversation</button>
    </div>
`;

export default class UserStatus extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$userStatus = this.shadowRoot.getElementById('user-status');
        this.$flirtBtn = this.shadowRoot.getElementById('flirt-btn');
        this.$biteBtn = this.shadowRoot.getElementById('bite-btn');
        this.$stopFlirtingBtn = this.shadowRoot.getElementById('stop-flirting-btn');
        this.$endConversationBtn = this.shadowRoot.getElementById('end-conversation-btn');
    }

    static get observedAttributes() {
        return ['status'];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if(attrName == 'status') {
            this.$userStatus.className = newValue;
        }
    }

    set status(value) {
        this.setAttribute('status', value);
    }

    get status() {
        return this.getAttribute('status');
    }

    set onFlirt(callback) {
        this.$flirtBtn.onclick = () => {
            callback();
            // this.status = 'flirting';
        };
    }

    set onBite(callback) {
        this.$biteBtn.onclick = () => {
            callback();
            // this.status = 'chatting';
        };;
    }

    set onStopFlirting(callback) {
        this.$stopFlirtingBtn.onclick = () => {
            callback();
            // this.status = 'free';
        };;
    }

    set onEndConversation(callback) {
        this.$endConversationBtn.onclick = () => {
            callback();
            // this.status = 'free';
        };;
    }
}