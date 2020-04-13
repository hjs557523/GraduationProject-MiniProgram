function base64_encode(str) { // 编码，配合encodeURIComponent使用
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var i = 0, len = str.length, strin = '';
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff; //charCodeAt() 方法可返回指定位置的字符的 Unicode 编码
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
            strin += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
            strin += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        strin += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return strin
}

function base64_decode(input) { // 解码，配合decodeURIComponent使用
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";//base64索引字符表
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");//匹配未包含A-Z, a-z, 0-9, +, /, =的所有字符，将其用""替代，即删除
    while (i < input.length) {
        enc1 = base64EncodeChars.indexOf(input.charAt(i++));//charAt(0) 范围：0-63 number类型占8个字节
        enc2 = base64EncodeChars.indexOf(input.charAt(i++));//charAt(1) 范围：0-63 
        enc3 = base64EncodeChars.indexOf(input.charAt(i++));//charAt(2) 范围：0-63 
        enc4 = base64EncodeChars.indexOf(input.charAt(i++));//charAt(3) 范围：0-63 
        chr1 = (enc1 << 2) | (enc2 >> 4);//取enc1的3-8位为高6位，enc2的3-4位为低2位
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);//取ecn2后四位作为高4位，enc3的3-6位为低4位
        chr3 = ((enc3 & 3) << 6) | enc4; //取ecn3的低2位作为高2位，enc4的3-8位为低6位
        output = output + String.fromCharCode(chr1);//fromCharCode(chr1)根据unicode编码值返回字符串
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
  return utf8_decode(output);// output是单字节字符组成的字符串，还需要utf-8解码
}


function utf8_decode(utftext) { // utf-8解码
    var string = '';
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) { //0xxxxxxx 1字节英文字符
            string += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {//110xxxxx 10xxxxxx：双字节编码形式；
            c1 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
            i += 2;
        } else { //1110xxxx 10xxxxxx 10xxxxxx：三字节编码形式；
            c1 = utftext.charCodeAt(i + 1);
            c2 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
            i += 3;
        }
    }
    return string;
}


module.exports = {
    base64_encode: base64_encode,
    base64_decode: base64_decode,
};
