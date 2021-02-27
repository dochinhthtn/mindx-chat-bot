import ComponentManager from "../ComponentManager.js";

const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <style>
        #message-list {
            padding: 10px;
        }
    </style>
    <div id="message-list"></div>
`;

export default class MessageList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$messageList = this.shadowRoot.getElementById('message-list');
    }

    static get observedAttributes() {
        return ['messages'];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if(attrName == 'messages') {
            let messages = JSON.parse(newValue);
            this.$messageList.innerHTML = '';
            messages.forEach(message => {
                let $messageContainer = ComponentManager.create('message-container', message);
                this.$messageList.appendChild($messageContainer);
            });
        }
    }

    set messages(data) {
        this.setAttribute('messages', JSON.stringify(data))
    }

    /**
     * 
     */
    get messages() {
        return JSON.parse(this.getAttribute('messages'));
    }
}