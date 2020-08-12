/* baybayin.js */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var consonants = { "B": "\u170A", "K": "\u1703", "D": "\u1707", "G": "\u1704", "H": "\u1711", "L": "\u170E", "M": "\u170B", "N": "\u1708", "NG": "\u1705", "P": "\u1709", "R": "\u170D", "S": "\u1710", "T": "\u1706", "W": "\u170F", "Y": "\u170C" };
var consonants_no_ra = __assign({}, consonants);
consonants_no_ra["R"] = consonants_no_ra["D"];
var vowels = { "A": "\u1700", "E": "\u1701", "I": "\u1701", "O": "\u1702", "U": "\u1702" };
var kudlit = { "A": null, "E": "\u1712", "I": "\u1712", "O": "\u1713", "U": "\u1713" };
var kudlit_hollow = { "A": null, "E": "\u1712\ufe00", "I": "\u1712", "O": "\u1713\ufe00", "U": "\u1713" };
var virama = "\u1714";
var pamudpod = "\u1734";
var Kudlit;
(function (Kudlit) {
    Kudlit[Kudlit["None"] = 0] = "None";
    Kudlit[Kudlit["Traditional"] = 1] = "Traditional";
    Kudlit[Kudlit["Hollow"] = 2] = "Hollow";
})(Kudlit || (Kudlit = {}));
var Baybayin = /** @class */ (function () {
    function Baybayin(settings) {
        if (!settings) {
            this.settings = { pamudpod: true, conjuncts: false, kudlit: Kudlit.Hollow, ra: true };
        }
        else {
            this.settings = settings;
        }
    }
    Baybayin.prototype.virama = function () {
        if (this.settings.kudlit == Kudlit.None) {
            return "";
        }
        else if (this.settings.pamudpod) {
            return pamudpod;
        }
        else {
            return virama;
        }
    };
    Baybayin.prototype._conjunct = function (c) {
        if (!this.settings.conjuncts)
            return c;
        switch (c) {
            case "F":
                return consonants["P"];
            case "Q":
                return consonants["K"] + this.virama() + consonants["W"];
            case "X":
                return consonants["K"] + this.virama() + consonants["S"];
            case "Z":
                return consonants["S"];
            case "J":
                return consonants["D"] + this.virama() + consonants["Y"];
            case "C":
                return consonants["K"];
        }
    };
    Baybayin.prototype.consonant_or_conjunct = function (s) {
        if (~"CQFZJX".indexOf(s)) {
            return this._conjunct(s);
        }
        else if (s.match(/[.,]/)) {
            return this.handle_punctuation(s);
        }
        else {
            return this.settings.ra ? consonants[s] : consonants_no_ra[s];
        }
    };
    Baybayin.prototype.handle_punctuation = function (s) {
        if (s == ".")
            return "\u1736";
        else if (s == ",")
            return "\u1735";
        else
            return s;
    };
    Baybayin.prototype.convert = function (from) {
        var s, s2;
        var ret = "";
        var fromA = from.toUpperCase().split("");
        do {
            s = fromA.shift();
            if (!s)
                break;
            if (s == "-")
                continue;
            s2 = fromA.shift();
            if (s == "N" && s2 == "G") {
                s = "NG";
            }
            else {
                fromA.unshift(s2);
            }
            if (s.match(/\s/)) {
                ret += s;
                continue;
            }
            else if (vowels[s] != undefined) {
                ret += vowels[s];
                continue;
            }
            s2 = fromA.shift();
            if ((~"CQFZJX".indexOf(s) || consonants[s] != undefined) && vowels[s2] != undefined) {
                ret += this.consonant_or_conjunct(s);
                if (s2 != "A") {
                    if (this.settings.kudlit == Kudlit.Traditional) {
                        ret += kudlit[s2];
                    }
                    else if (this.settings.kudlit == Kudlit.Hollow) {
                        ret += kudlit_hollow[s2];
                    }
                    else { // Kudlit.None
                    }
                }
            }
            else if (!~"CQFZJX".indexOf(s) && consonants[s] == undefined) {
                ret += this.handle_punctuation(s);
                if (s2)
                    ret += this.handle_punctuation(s2);
            }
            else {
                ret += this.consonant_or_conjunct(s);
                ret += this.virama();
                if (s2)
                    fromA.unshift(s2);
            }
        } while (fromA.length > 0);
        return ret;
    };
    return Baybayin;
}());
