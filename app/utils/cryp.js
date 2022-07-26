const  NodeRSA   = require("node-rsa");
const md5 = require("crypto-js/md5");

const key=new NodeRSA({b:512});
key.setOptions({encryptionScheme:'pkcs1'});
const pubkey=key.exportKey('public');

//md5的盐
const salt='blog_express_password_salt';

/**
 * rsa 加密 并返回
 * @param {*} content 
 */
 function encrypt(content){
    return key.encrypt(content,'base64');
}

/**
 * rsa 解密 并返回
 * @param {*} content 
 */
 function decrypt(content){
    // const prikey=key.exportKey('private');
    return key.decrypt(content,'utf8');
}

function genPassword(password){
   return md5(password+salt).toString();
}

module.exports={
    encrypt,
    decrypt,
    genPassword,
    pubkey
}