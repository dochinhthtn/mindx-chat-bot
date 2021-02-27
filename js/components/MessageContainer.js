const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <style>
        * {
            font-family: Arial;
        }

        #message-container {
            margin: 5px 0px;
        }

        #content {
            display: inline-block;
            max-width: 50%;
            font-size: 16px;
            border-radius: 10px;
            word-break: break-word;
            padding: 10px;
            color: #212121;
            background-color: #dadada;
        }

        .owned {
            text-align: right;
        }

        .owned > #content {
            color: #FFFFFF;
            background-color: #665DFE;
        }
    </style>
    <div id="message-container">
        <span id="content">Hello</span>
    </div>
`;

export default class MessageContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.append($template.content.cloneNode(true));

        this.$messageContainer = this.shadowRoot.getElementById('message-container');
        this.$content = this.shadowRoot.getElementById('content');
    }

    static get observedAttributes() {
        return ['content', 'owned', 'date-modified'];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if(attrName == 'content') {
            this.$content.innerHTML = newValue;
        } else if(attrName == 'owned') {
            this.$messageContainer.className = (newValue == 'true') ? 'owned' : '';
        } else if(attrName == 'date-modified') {
            this.$content.title = newValue;
        }
    }

    get content() {
        return this.getAttribute('content');
    }

    set content(value) {
        this.setAttribute('content', value);
    }

    get owned() {
        return this.getAttribute('owned');
    }

    set owned(value) {
        this.setAttribute('owned', value);
    }

    get dateModified() {
        return this.getAttribute('date-modified');
    }

    set dateModified(value) {
        this.setAttribute('date-modified', value);
    }

}

