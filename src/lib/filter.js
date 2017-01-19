/**
 * Created by marszed on 16/11/9.
 */
// 过滤器

let Filter = {}
var locationHref = window.location.href,
    userAgent = window.navigator.userAgent

var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" +  "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=";

// get query key-value
Filter.getQueryString = function(name){
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = locationHref.split('?')[1] ? locationHref.split('?')[1].match(reg) : '';
  if (r != null) return decodeURI(r[2]);
  return null;
}

// is wechat
Filter.isWeiXin = function() {
  var ua = userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

// is IOS
Filter.isIOS = function(){
  if(userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
    return true
  } else {
    return false
  }
}

// timeDate format
Filter.timeFormat = function (format, date, datePipe, timePipe) {
  var type = typeof date,
    datePipe = typeof datePipe != 'undefined' ? datePipe : '-'
  timePipe = typeof timePipe != 'undefined' ? timePipe : ':'
  var ret = null
  if (type == 'string' || type == "number") {
    var oDate = new Date(date)
  } else if (type == 'object') {
    var oDate = date
  } else {
    var oDate = new Date()
  }

  var Y = oDate.getFullYear(), M = oDate.getMonth() + 1, D = oDate.getDate()
  var H = oDate.getHours(), I = oDate.getMinutes(), S = oDate.getSeconds()

  var c = function (a, pipe) {
    var ret = [];
    for (var i = 0, len = a.length; i < len; i++) {
      var x = a[i];
      x = x < 10 ? '0' + x : x
      ret.push(x)
    }
    return ret.join(pipe);
  };

  switch (format) {
    case 'YM':
      ret = c([Y, M], datePipe)
      break;
    case 'MD':
      ret = c([M, D], datePipe)
      break;
    case 'HI':
      ret = c([H, I], timePipe)
      break;
    case 'HIS':
      ret = c([H, I, S], timePipe)
      break;
    case 'IS':
      ret = c([I, S], timePipe)
      break;
    case 'YMDHI':
      ret = c([Y, M, D], datePipe) + ' ' + c([H, I], timePipe)
      break;
    case 'YMDHIS':
      ret = c([Y, M, D], datePipe) + ' ' + c([H, I, S], timePipe)
      break;
    case 'YMD':
      ret = c([Y, M, D], datePipe)
      break;
    default:
      ret = c([Y, M, D], datePipe)
  }
  return ret
}

// today yesterday timeDate format
Filter.todayFormat = function(date,type){
  let currentTime = new Date()
  let dateFormat = new Date(date)
  // 如果只需要年月日时分
  if(type == 'YMDHI'){
    return Filter.timeFormat('YMDHI',date)
  }
  // 今天
  if(dateFormat.getDate() == currentTime.getDate()){
    return '今天 '+Filter.timeFormat('HI',date)
  } else if (dateFormat.getDate() == currentTime.getDate()-1){
    // 昨天
    return '昨天 '+Filter.timeFormat('HI',date)
  } else {
    return Filter.timeFormat('YMDHI',date)
  }
}

//get sessionStorage
Filter.getSessionStorage = function (key) {
  var r;
  if (window.sessionStorage) {
    r = JSON.parse(window.sessionStorage.getItem(key));
  }
  return r;
};

//set sessionStorage
Filter.setSessionStorage = function (key, value) {
  value = JSON.stringify(value);
  if (window.sessionStorage) {
    window.sessionStorage.setItem(key, value);
  }
};

//get localStorage
Filter.getLocalStorage = function (key) {
  var r;
  if (window.localStorage) {
    r = JSON.parse(window.localStorage.getItem(key));
  }
  return r;
};

//set localStorage
Filter.setLocalStorage = function (key, value) {
  value = JSON.stringify(value);
  if (window.localStorage) {
    window.localStorage.setItem(key, value);
  }
};

//del localStorage
Filter.delLocalStorage = function (key) {
  if (window.localStorage) {
    window.localStorage.removeItem(key);
  }
};

// update localStorage key value
Filter.updateLocalStorage = function (type, key, val) {
  var obj = Filter.getLocalStorage(type) ? Filter.getLocalStorage(type) : false;
  if (obj) {
    for (var k in obj) {
      if (k == key) {
        if (val === 'delete') {
          delete obj[k];
          Filter.setLocalStorage(type, obj);
          break;
        } else {
          obj[key] = val;
        }
      } else {
        obj[val.proId] = val;
      }
      Filter.setLocalStorage(type, obj);
    }
  } else {
    var temp = {};
    temp[key] = val;
    Filter.setLocalStorage(type, temp);
  }
};


String.prototype.trim = function(){
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

// get set cookie
Filter.cookie = function (name, value, options) {
  if (typeof value != 'undefined') {
    options = options || {};
    if (value === null) {
      value = '';
      options = $.extend({}, options);
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      }
      else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString();
    }
    var path = options.path ? '; path=' + (options.path) : '';
    var domain = options.domain ? '; domain=' + (options.domain) : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [
      name,
      '=',
      encodeURIComponent(value),
      expires,
      path,
      domain,
      secure
    ].join('');
  }
  else {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0, len = cookies.length; i < len; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};

// base64加密
Filter.encode64 = function (input) {
  input = escape(input);
  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;
  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    }
    else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output = output +
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);
  return output;
};

// base64解密
Filter.decode64 = function (input) {
  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;
  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  var base64test = /[^A-Za-z0-9\+\/\=]/g;
  if (base64test.exec(input)) {
    console && console.log("There were invalid base64 characters in the input text.\n" +
      "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
      "Expect errors in decoding.");
  }
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);
  return unescape(output);
};

export default Filter
