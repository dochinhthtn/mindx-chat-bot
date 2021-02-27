import User from './models/User.js';

let $app = document.getElementById('app');

let router = new Navigo(null, true, '#');

router.on('/', async function() {
    let currentUser = await User.auth();
    if(currentUser) {
        router.navigate('/chat');
    } else {
        router.navigate('/auth');
    }

    console.log('a');
}).resolve();

router.on('/auth', async function() {
    let currentUser = await User.auth();
    if(currentUser) {
        router.navigate('/chat');
        return;
    }

    $app.innerHTML = '<auth-screen></auth-screen>';
}).resolve();


router.on('/chat', async function() {
    let currentUser = await User.auth();
    if(!currentUser) {
        router.navigate('/auth');
        return;
    }

    $app.innerHTML = '<chat-screen></chat-screen>';

}).resolve();

window.router = router;