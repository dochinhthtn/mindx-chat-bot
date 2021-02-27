import { validateEmail } from "../utils.js";

const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <style>
    * {
        font-family: Arial;
    }

    input-wrapper {
        display: block;
        margin: 10px 0px;
    }

    #register-form {
        text-align: center;
    }

    #register-btn {
        height: 40px;
        font-size: 18px;
        width: 100%;
        background-color: #4237FE;
        border: 1px solid #4237FE;
        color: #FFFFFF;
        border-radius: 3px;
    }
    </style>

    <form id="register-form">
        <h2>Create an account</h2>
        <p>We are Different, We Make You Different.</p>
        <input-wrapper placeholder="Name" type="text" id="name"></input-wrapper>
        <input-wrapper placeholder="Email" type="email" id="email"></input-wrapper>
        <input-wrapper placeholder="Password" type="password" id="password"></input-wrapper>
        <input-wrapper placeholder="Confirm password" type="password" id="password-confirmation"></input-wrapper>
        <button id="register-btn">Register</button>
    </form>
`;

export default class RegisterForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$registerForm = this.shadowRoot.getElementById('register-form');
        this.$name = this.shadowRoot.getElementById('name');
        this.$email = this.shadowRoot.getElementById('email');
        this.$password = this.shadowRoot.getElementById('password');
        this.$passwordConfirmation = this.shadowRoot.getElementById('password-confirmation');
    }

    validate() {

        return this.$name.validate(value => value != '', "Invalid name")
            & this.$email.validate(value => value != '' && validateEmail(value), "Invalid email")
            & this.$password.validate(value => value != '', "Invalid password")
            & (this.$passwordConfirmation.validate(value => value != '', "Invalid password confirmation") 
            && this.$passwordConfirmation.validate(value => value == this.$password.value, "Password confirmation is not match with password"));
    }

    set onRegister(callback) {
        this.$registerForm.onsubmit = (event) => {
            event.preventDefault();
            if(this.validate()) {
                callback({
                    name: this.$name.value,
                    email: this.$email.value,
                    password: this.$password.value,
                });
            }
        }
    }
}