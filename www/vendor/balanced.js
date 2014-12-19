////
// balanced.js
// version: 1.1.11
// built: 2014-01-15
// https://github.com/balanced/balanced-js
////

!function(exports, global) {
    function preparePayload(data) {
        data.meta || (data.meta = {}), capabilities.submitted = 1 * new Date(), capabilities.scrollX = window.scrollX,
        capabilities.scrollY = window.scrollY;
        for (var k in capabilities) "capabilities_" + k in data.meta || (data.meta["capabilities_" + k] = capabilities[k]);
        return data;
    }
    function addEvent(obj, type, fn) {
        obj.addEventListener ? obj.addEventListener(type, fn, !1) : obj.attachEvent && (obj["e" + type + fn] = fn,
        obj[type + fn] = function() {
            obj["e" + type + fn](window.event);
        }, obj.attachEvent("on" + type, obj[type + fn]));
    }
    function icl(e) {
        e = e ? e : window.event;
        var shifton = !1;
        return e.shiftKey ? shifton = e.shiftKey : e.modifiers && (shifton = !!(4 & e.modifiers)),
        shifton && (shifted = !0), shifted;
    }
    function isEmpty(obj) {
        if (null == obj) return !0;
        for (var key in obj) if (hasOwnProperty.call(obj, key)) return !1;
        return !0;
    }
    function buildErrorObject(key, message) {
        var error = {}, extras = {};
        if ("object" == typeof key) for (var i = 0; i < key.length; i++) extras[key[i]] = message; else extras[key] = message;
        return error.description = message, error.extras = extras, error;
    }
    function validateData(requiredKeys, data, errors) {
        for (var i = 0; i < requiredKeys.length; i++) {
            var key = requiredKeys[i];
            data && key in data && data[key] || errors.push(buildErrorObject(key, "Invalid field [" + key + '] - Missing field "' + key + '"'));
        }
    }
    function validate(details, requiredKeys, validationMethod) {
        var errors = [];
        validateData(requiredKeys, details, errors);
        var additionalErrors = validationMethod(details);
        errors = errors.concat(additionalErrors);
        for (var i = 0; i < errors.length; i++) errors[i].status = "Bad Request", errors[i].category_code = "request",
        errors[i].additional = null, errors[i].status_code = 400, errors[i].category_type = "request";
        return errors;
    }
    function noDataError(callback, message) {
        var m = message ? message : "No data supplied";
        if (!callback) throw m;
        callback({
            errors: {
                description: m,
                status: "Bad Request",
                category_code: "request",
                additional: null,
                status_code: 400,
                category_type: "request",
                extras: {}
            }
        });
    }
    function jsonp(path, callback) {
        var funct = "balanced_jsonp_" + Math.random().toString().substr(2), tag = document.createElement("script");
        tag.type = "text/javascript", tag.async = !0, tag.src = path.replace("{callback}", funct);
        var where = document.getElementsByTagName("script")[0];
        where.parentNode.insertBefore(tag, where), window[funct] = function(result) {
            try {
                callback(result);
            } catch (e) {
                "undefined" != typeof console && console.error && console.error(e);
            }
            tag.parentNode.removeChild(tag);
        };
    }
    function make_url(path, data) {
        return root_url + path + "?callback={callback}&data=" + encodeURI(JSON.stringify(data));
    }
    function make_callback(callback) {
        function ret(data) {
            if (!called_back) {
                if (called_back = !0, !data || !data.status) return callback({
                    description: "Unable to connect to the balanced servers",
                    status: "Internal Server Error",
                    category_code: "server-error",
                    additional: null,
                    status_code: 500,
                    category_type: "server-error",
                    extras: {}
                }), void 0;
                var body = JSON.parse(data.body);
                "undefined" != typeof data.status && (body.status_code = data.status), callback(body);
            }
        }
        var called_back = !1;
        return setTimeout(ret, 6e4), ret;
    }
    global.balanced = exports;
    var capabilities = {
        system_timezone: -new Date().getTimezoneOffset() / 60,
        user_agent: navigator.userAgent,
        language: navigator.userLanguage || navigator.language,
        kp: 0,
        cli: 0,
        loaded: 1 * new Date(),
        screen_width: screen.width,
        screen_length: screen.height,
        hist: window.history.length,
        cookie: function() {
            var cookie = document.cookie.match(/__b=([a-zA-Z0-9\-!\.]+)/);
            cookie = cookie ? cookie[1] : 1 * new Date() + "." + Math.random().toString().substr(2) + ".0!0",
            cookie = cookie.split("!");
            var cookie_parts = cookie[0].split(".");
            cookie_parts.length < 3 && (cookie_parts[1] = Math.random().toString().substr(2),
            cookie_parts[2] = 0), cookie_parts[2]++, cookie = cookie_parts.join(".") + "!" + cookie[1];
            var cookie_date = new Date();
            return cookie_date.setDate(cookie_date.getDate() + 365), document.cookie = "__b=" + cookie + " ;expires=" + cookie_date.toUTCString(),
            cookie;
        }()
    }, shifted = !1;
    addEvent(window, "keydown", function(e) {
        capabilities.cl || (capabilities.cl = icl(e)), capabilities.kp++;
    }), addEvent(window, "paste", function() {
        capabilities.ps = !0;
    }), addEvent(window, "click", function() {
        capabilities.cli++;
    }), String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    });
    var cc = {
        isCardNumberValid: function(cardNumber) {
            if (!cardNumber) return !1;
            if (cardNumber = (cardNumber + "").replace(/\D+/g, "").split("").reverse(), !cardNumber.length || cardNumber.length < 12) return !1;
            var i, total = 0;
            for (i = 0; i < cardNumber.length; i++) cardNumber[i] = parseInt(cardNumber[i], 10),
            total += i % 2 ? 2 * cardNumber[i] - (cardNumber[i] > 4 ? 9 : 0) : cardNumber[i];
            return 0 === total % 10;
        },
        cardType: function(cardNumber) {
            var p = {};
            if (p["51"] = p["52"] = p["53"] = p["54"] = p["55"] = "Mastercard", p["34"] = p["37"] = "American Express",
            p["4"] = "VISA", p["6"] = "Discover Card", p["35"] = "JCB", p["30"] = p["36"] = p["38"] = "Diners Club",
            cardNumber) {
                cardNumber = cardNumber.toString().trim();
                for (var k in p) if (0 === cardNumber.indexOf(k)) return p[k];
            }
            return null;
        },
        isSecurityCodeValid: function(cardNumber, cvv) {
            var cardType = cc.cardType(cardNumber);
            if (!cardType) return !1;
            var requiredLength = "American Express" === cardType ? 4 : 3;
            return "string" != typeof cvv && "number" != typeof cvv || cvv.toString().replace(/\D+/g, "").length !== requiredLength ? !1 : !0;
        },
        isExpiryValid: function(expiryMonth, expiryYear) {
            if (!expiryMonth || !expiryYear) return !1;
            if (expiryMonth = parseInt(expiryMonth, 10), expiryYear = parseInt(expiryYear, 10),
            isNaN(expiryMonth) || isNaN(expiryYear) || expiryMonth > 12 || 1 > expiryMonth) return !1;
            var today = new Date();
            return !(today.getFullYear() > expiryYear || today.getFullYear() === expiryYear && today.getMonth() >= expiryMonth);
        },
        validate: function(cardData) {
            cardData.number && (cardData.number = cardData.number.toString().trim());
            var number = cardData.number, cvv = cardData.cvv, expiryMonth = cardData.expiration_month, expiryYear = cardData.expiration_year, errors = [];
            return cc.isCardNumberValid(number) || errors.push(buildErrorObject("number", 'Invalid field [number] - "' + number + '" is not a valid credit card number')),
            "undefined" == typeof cvv || null === cvv || cc.isSecurityCodeValid(number, cvv) || errors.push(buildErrorObject("cvv", 'Invalid field [cvv] - "' + cvv + '" is not a valid credit card security code')),
            cc.isExpiryValid(expiryMonth, expiryYear) || errors.push(buildErrorObject([ "expiration_month", "expiration_year" ], 'Invalid field [expiration_month,expiration_year] - "' + expiryMonth + "-" + expiryYear + '" is not a valid credit card expiration date')),
            errors;
        },
        create: function(data, callback) {
            if (!data) return noDataError(callback), void 0;
            var requiredKeys = [ "number", "expiration_month", "expiration_year" ], errors = validate(data, requiredKeys, cc.validate);
            isEmpty(errors) ? jsonp(make_url("/jsonp/cards", preparePayload(data)), make_callback(callback)) : callback({
                errors: errors
            });
        }
    }, em = {
        validate: function(emailAddress) {
            return emailAddress && emailAddress.match(/[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?/i) ? !0 : !1;
        }
    }, ba = {
        types: [ "savings", "checking" ],
        validate: function(accountData) {
            var noun = "routing_number" in accountData ? "routing_number" : "bank_code", bankCode = accountData[noun], errors = [];
            return ba.validateRoutingNumber(bankCode) || errors.push(buildErrorObject(noun, "Invalid field [" + noun + '] - "' + bankCode + '" is not a valid ' + noun.replace("_", " "))),
            "type" in accountData && !ba.validateType(accountData.type) && errors.push(buildErrorObject("type", 'Invalid field [type] - "' + accountData.type + '" must be one of: "' + ba.types.join('", "') + '"')),
            errors;
        },
        validateRoutingNumber: function(routingNumber) {
            if (!routingNumber) return !1;
            if (routingNumber = routingNumber.toString().match(/\d+/g), !routingNumber) return !1;
            if (routingNumber = routingNumber.join(""), !routingNumber || 9 !== routingNumber.length) return !1;
            for (var a = routingNumber.toString().split(""), d = [], i = 0; i < a.length; i++) d.push(parseInt(a[i], 10));
            return d[8] === (7 * (d[0] + d[3] + d[6]) + 3 * (d[1] + d[4] + d[7]) + 9 * (d[2] + d[5])) % 10;
        },
        lookupRoutingNumber: function(routingNumber, callback) {
            if (!routingNumber) return noDataError(callback), void 0;
            var uri = "/bank_accounts/routing_numbers/" + routingNumber;
            jsonp(make_url(uri, null, make_callback(callback)));
        },
        validateType: function(type) {
            return type ? ba.types.indexOf(type) >= 0 : !0;
        },
        create: function(data, callback) {
            if (!data) return noDataError(callback), void 0;
            var requiredKeys = [ "name", "account_number", "routing_number" ], errors = validate(data, requiredKeys, ba.validate);
            isEmpty(errors) ? jsonp(make_url("/jsonp/bank_accounts", preparePayload(data)), make_callback(callback)) : callback({
                errors: errors
            });
        }
    }, root_url = "https://api.balancedpayments.com";
    "object" != typeof JSON && jsonp("https://js.balancedpayments.com/json2.js"), global.balanced = {
        card: cc,
        bankAccount: ba,
        emailAddress: em,
        init: function(args) {
            args && "server" in args && (root_url = args.server);
        }
    };
}({}, function() {
    return this;
}());
