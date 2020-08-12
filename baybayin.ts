/* baybayin.js */

type Consonant = "B" | "K" | "D" | "G" | "H" | "L" | "M" | "N" | "NG" | "P" | "R" | "S" | "T" | "W" | "Y";
type Vowel = "A" | "E" | "I" | "O" | "U";

type Conjunct = "Q" | "F" | "Z" | "J" | "X";

const consonants: Record<Consonant, string> = {"B": "\u170A", "K": "\u1703", "D": "\u1707", "G": "\u1704", "H": "\u1711", "L": "\u170E", "M": "\u170B", "N": "\u1708", "NG": "\u1705", "P": "\u1709", "R": "\u170D", "S": "\u1710", "T": "\u1706", "W": "\u170F", "Y": "\u170C"};
const consonants_no_ra: Record<Consonant, string> = {...consonants};
consonants_no_ra["R"] = consonants_no_ra["D"]

const vowels: Record<Vowel, string> = {"A": "\u1700", "E": "\u1701", "I": "\u1701", "O": "\u1702", "U": "\u1702"}

const kudlit: Record<Vowel, string | null> = {"A": null, "E": "\u1712", "I": "\u1712", "O": "\u1713", "U": "\u1713"}

const kudlit_hollow: Record<Vowel, string | null> = {"A": null, "E": "\u1712\ufe00", "I": "\u1712", "O": "\u1713\ufe00", "U": "\u1713"}

const virama: string = "\u1714";

const pamudpod: string = "\u1734";

enum Kudlit {
    None,
    Traditional,
    Hollow
}

interface BaybayinSettings {
    pamudpod: boolean;
    ra: boolean;
    kudlit: Kudlit;
}

class Baybayin {
    settings: BaybayinSettings;

    constructor(settings?: BaybayinSettings) {
        if (!settings) {
            this.settings = {pamudpod: true, kudlit: Kudlit.Hollow, ra: true};
        } else {
            this.settings = settings;
        }
    }

    virama(): string {
        if (this.settings.kudlit == Kudlit.None) {
            return "";
        } else if (this.settings.pamudpod) {
            return pamudpod;
        } else {
            return virama;
        }
    }

    _conjunct(c: Conjunct): string {
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
        }
    }

    consonant_or_conjunct(s: string): string {
        if (~"QFZJX".indexOf(s)) {
            return this._conjunct(<Conjunct>s);
        } else {
            return this.settings.ra ? consonants[s] : consonants_no_ra[s];
        }
    }

    convert(from: string): string {
        let s, s2: string;
        let ret: string = "";
        let fromA: Array<string> = from.toUpperCase().split("");

        do {
            s = fromA.shift();

            if (!s) break;

            s2 = fromA.shift();

            if (s == "N" && s2 == "G") {
                s = "NG";
            } else {
                fromA.unshift(s2);
            }

            if (s.match(/\s/)) {
                ret += s;
                continue;
            } else if (vowels[s] != undefined) {
                ret += vowels[s];
                continue;
            }

            s2 = fromA.shift();

            if ((~"QFZJX".indexOf(s) || consonants[s] != undefined) && vowels[s2] != undefined) {
                ret += this.consonant_or_conjunct(s);
                if (s2 != "A") {
                    if (this.settings.kudlit == Kudlit.Traditional) {
                        ret += kudlit[s2];
                    } else if (this.settings.kudlit == Kudlit.Hollow) {
                        ret += kudlit_hollow[s2];
                    } else { // Kudlit.None
                    }
                }
            } else if (!~"QFZJX".indexOf(s) && consonants[s] == undefined) {
                ret += s;
                if (s2) ret += s2;
            } else {
                ret += this.consonant_or_conjunct(s);
                ret += this.virama();
                if (s2) fromA.unshift(s2);
            }

        } while (fromA.length > 0);

        return ret;
    }
}
