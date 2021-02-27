let $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <style>

        #input-wrapper {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        #label {
            color: #CDCDD1;
            font-size: 16px;
        }

        #main {
            box-sizing: border-box;
            height: 40px;
            padding: 0px 10px;
            font-size: 18px;
            outline: none;
            background-color: #FFFFFF;
            border: 1px solid #ced4da;
            border-radius: 3px;
            color: #495057;
            width: 100%;
        }

        #main::placeholder {
            color: #CDCDD1;
        }

        #error {
            color: #DD5044;
            font-size: 15px;
        }
    </style>

    <div id="input-wrapper">
        <label for="main" id="label"></label>
        <input type="text" name="" id="main">
        <div id="error"></div>
    </div>
`;

export default class InputWrapper extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$label = this.shadowRoot.getElementById('label');
        this.$main = this.shadowRoot.getElementById('main');
        this.$error = this.shadowRoot.getElementById('error');
    }

    static get observedAttributes() {
        return ['label', 'error', 'type', 'value', 'placeholder'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'label':
                this.$label.innerHTML = newValue;
                break;

            case 'type':
                this.$main.type = newValue;
                break;

            case 'error':
                this.$error.innerHTML = newValue;
                break;

            case 'value':
                this.$main.value = newValue;
                break;

            case 'placeholder':
                this.$main.placeholder = newValue;
                break;
        }
    }

    /**
     * Validate input-wrapper's data with rule
     * @param {CallableFunction} rule 
     * @returns {Boolean}
     */
    validate(rule, message) {
        if (rule(this.value)) {
            this.error = "";
            return true;
        }
        
        this.error = message;
        return false;

    }

    get label() {
        return this.getAttribute('label');
    }

    set label(value) {
        this.setAttribute('label', value);
    }

    get error() {
        return this.getAttribute('error');
    }

    set error(value) {
        this.setAttribute('error', value);
    }

    get value() {
        return this.$main.value.trim();
    }

    set value(value) {
        this.$main.value = value.trim();
    }

    get type() {
        return this.getAttribute('type');
    }

    set type(value) {
        this.setAttribute('type', value);
    }

}
