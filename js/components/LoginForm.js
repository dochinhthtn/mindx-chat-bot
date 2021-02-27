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

        #login-form {
            text-align: center;
        }

        #login-btn {
            height: 40px;
            font-size: 18px;
            width: 100%;
            background-color: #4237FE;
            border: 1px solid #4237FE;
            color: #FFFFFF;
            border-radius: 3px;
        }
    </style>

    <form id="login-form">
        <h2>Login to your account</h2>
        <p>We are Different, We Make You Different.</p>
        <input-wrapper placeholder="Email" type="email" id="email"></input-wrapper>
        <input-wrapper placeholder="Password" type="password" id="password"></input-wrapper>
        <button id="login-btn">Login</button>
    </form>
`;

export default class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$loginForm = this.shadowRoot.getElementById('login-form');
        this.$email = this.shadowRoot.getElementById('email');
        this.$password = this.shadowRoot.getElementById('password');
    }

    /**
     * Validate login form
     * @returns {Boolean}
     */
    validate() {
        return this.$email.validate(function(value) {
            return value != '';
        }, "Input your name") & this.$password.validate(function(value) {
            return value != '';
        }, "Input your password");
    }

    /**
     * Set login handler
     * @param {CallableFunction} callback 
     */
    set onLogin(callback) {
        this.$loginForm.onsubmit = (event) => {
            event.preventDefault();
            if(this.validate()) {
                callback({
                    email: this.$email.value, 
                    password: this.$password.value
                });
            }
        }
    }
}