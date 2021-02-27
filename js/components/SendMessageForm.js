const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <link rel="stylesheet" href="../../fontawesome/css/all.min.css">
    <style>
        #send-message-form {
            display: flex;
            justify-content: space-between;
            padding: 0px 10px;
        }

        #send-btn {
            width: 60px;
            height: 40px;
            font-family: Arial;
            background-color: #665DFE;
            border: 1px solid #665DFE;
            border-radius: 3px;
            font-size: 18px;
            color: #ffffff;
        }

        #content {
            width: calc(100% - 70px);
        }
    </style>
    <form id="send-message-form">
        <input-wrapper id="content" type="text" placeholder="Enter message"></input-wrapper>
        <button id="send-btn"><i class="fas fa-paper-plane"></i></button>
    </form>
`;

export default class SendMessageForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$sendMessageForm = this.shadowRoot.getElementById('send-message-form');
        this.$content = this.shadowRoot.getElementById('content');
    }

    validate() {
        return this.$content.validate(value => value != '', "");
    }

    set onSendMessage(callback) {
        this.$sendMessageForm.onsubmit = (event) => {
            event.preventDefault();
            if(this.validate()) {
                callback({
                    content: this.$content.value
                });
            }

            this.$content.value = '';
        }
    }
}