import AppStat from "./components/AppStat.js";
import ChatContainer from "./components/ChatContainer.js";
import InputWrapper from "./components/InputWrapper.js";
import LoginForm from "./components/LoginForm.js";
import MessageContainer from "./components/MessageContainer.js";
import MessageList from "./components/MessageList.js";
import RegisterForm from "./components/RegisterForm.js";
import UserStatus from "./components/UserStatus.js";
import SendMessageForm from "./components/SendMessageForm.js"
import AuthScreen from "./screens/AuthScreen.js";
import ChatScreen from "./screens/ChatScreen.js";
class ComponentManager {
    
    /**
     * Register web components here
     * @returns {Object}
     */
    static register() {
        return {
            'input-wrapper': InputWrapper,
            'login-form': LoginForm,
            'register-form': RegisterForm,
            'app-stat': AppStat,
            'user-status': UserStatus,
            'message-container': MessageContainer,
            'message-list': MessageList,
            'send-message-form': SendMessageForm,
            'chat-container': ChatContainer,

            'auth-screen': AuthScreen,
            'chat-screen': ChatScreen
        };
    }

    /**
     * Define custom elements 
     */
    static boot() {
        let components = ComponentManager.register();
        for (let tagName in components) {
            window.customElements.define(tagName, components[tagName]);
        }
    }

    /**
     * Create component instance with data
     * @param {string} name 
     * @param {Object} props 
     * @returns {HTMLElement}
     */
    static create(name, props = {}) {
        let element = document.createElement(name);

        for (let key in props) {
            element[key] = props[key];
        }

        return element;
    }
}


export default ComponentManager;