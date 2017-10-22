export const util = {
    setCookie(name, value, expiredays) {
        if (name && value) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = name + "=" + escape(value) + ((expiredays == null)
                ? ""
                : ";expires=" + exdate.toGMTString());
        }
    },
    getCookie(name) {
        if (document.cookie.length > 0) {
            var start = document
                .cookie
                .indexOf(name + "=");
            if (start !== -1) {
                start = start + name.length + 1;
                var c_end = document
                    .cookie
                    .indexOf(";", start);
                if (c_end === -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(start, c_end));
            }
        }
        return "";
    },
    delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = util.getCookie(name);
        if (cval != null) 
            document.cookie = name + "=" + cval + ";expires =" + exp.toGMTString();
        }
    }