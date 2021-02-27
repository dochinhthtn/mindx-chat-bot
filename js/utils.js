export function generateToken(str) {
    return CryptoJS.AES.encrypt(str, 'my-key');
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function md5(string) {
    return CryptoJS.MD5(string).toString();
}

// export class Auth {
//     static currentUser;

//     static async check() {
//         if(this.currentUser) return this.currentUser;

//         let token = localStorage.getItem('token');
//         if(!token) return null;

//         let docs = await User.where([
//             ['token', '==', token]
//         ]);

//         if (docs.length == 0) {
//             return null;
//         }

//         this.currentUser = docs;
//         return this.currentUser;
//     }
// }