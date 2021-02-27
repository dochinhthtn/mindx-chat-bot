import User from "../models/User.js";

const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <style>
        * {
            font-family: Arial;
        }
        #auth-screen {
            position: relative;
            margin: 50px auto;
            border-radius: 3px;
            box-sizing: border-box;
            width: 900px;
            height: 500px;
            border: 1px solid #cccccc;
            display: flex;
            justify-content: space-around;
            align-items: center;
            overflow: hidden;
        }

        login-form, register-form {
            width: 400px;
        }

        #folder {
            width: 450px;
            height: 500px;
            box-sizing: border-box;
            color: #FFFFFF;
            padding: 50px;
            position: absolute;
            background-color: #665DFE;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: left 0.3s;
        }

        .hide-login {
            top: 0px;
            left: 0px;
        }

        .hide-login #back-to-register {
            display: none;
        }

        .hide-register {
            top: 0px;
            left: 450px;
        }

        .hide-register #back-to-login {
            display: none;
        }

        .switch-btn {
            height: 40px;
            width: 120px;
            border: 2px solid #fff;
            border-radius: 10px;
            background: none;
            color: #fff;
            font-size: 18px;
        }
    </style>
    <section id="auth-screen">
        <login-form></login-form>
        <register-form></register-form>
        <div id="folder" class="hide-register">
            <div id="back-to-login">
                <h2>Welcome Back!</h2>
                <p>To keep connected with us, please login with your personal info</p>
                <button class="switch-btn" id="to-login-btn">Login</button>
                </div>
                
            <div id="back-to-register">
                <h2>Hello Friend!</h2>
                <p>Enter your personal details and start journey with us</p>
                <button class="switch-btn" id="to-register-btn">Register</button>
            </div>
        </div>
    </section>
`;

export default class AuthScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$folder = this.shadowRoot.getElementById('folder');

        this.$toRegister = this.shadowRoot.getElementById('to-register-btn');
        this.$toLogin = this.shadowRoot.getElementById('to-login-btn');

        this.$loginForm = this.shadowRoot.querySelector('login-form');
        this.$registerForm = this.shadowRoot.querySelector('register-form');
    }

    connectedCallback() {
        this.$toRegister.onclick = this.showRegisterForm.bind(this);
        this.$toLogin.onclick = this.showLoginForm.bind(this);

        this.$loginForm.onLogin = this.loginHandler.bind(this);
        this.$registerForm.onRegister = this.registerHandler.bind(this);
    }

    showLoginForm() {
        this.$folder.className = 'hide-register';
    }

    showRegisterForm() {
        this.$folder.className = 'hide-login';
    }

    async loginHandler(credential) {
        try {
            await User.signIn(credential);
            router.navigate('/chat');
        } catch(error) {
            alert(error.message);
        }
    }

    async registerHandler(credential) {
        try {
            credential.status = 'free';
            await User.signUp(credential);
            alert("Create account successfully. Please login!");
            this.showLoginForm();
        } catch(error) {
            alert(error.message);
        }
    }

}