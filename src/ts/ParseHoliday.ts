import * as moment from 'moment';

declare global {
    function parseHoliday(date: string, adjust: boolean)
}

function arrayify(arr) {
    if (arr && arr.constructor !== Array) { return [arr]; }
    return arr;
};



// taken from https://github.com/kodie/moment-holiday
export default class ParseHoliday {
    static calculateEaster(y) {
        var c = Math.floor(y / 100);
        var n = y - 19 * Math.floor(y / 19);
        var k = Math.floor((c - 17) / 25);
        var i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
        i = i - 30 * Math.floor((i / 30));
        i = i - Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
        var j = y + Math.floor(y / 4) + i + 2 - c + Math.floor(c / 4);
        j = j - 7 * Math.floor(j / 7);
        var l = i - j;
        var m = 3 + Math.floor((l + 40) / 44);
        var d = l + 28 - 31 * Math.floor(m / 4);
        return moment([y, (m - 1), d]);
    }

    static EasterParser(date) : any {
        if (~date.indexOf('easter')) {
            var dates = date.split('|');
            var ds = [];

            for (var i = 0; i < dates.length; i++) {
                if (dates[i].substring(0, 6) === 'easter') {
                    var easterSplit = dates[i].split('/');
                    var year = easterSplit[easterSplit.length - 1];
                    var easterComp = easterSplit[0];
                    var e = ParseHoliday.calculateEaster(year);

                    if (easterComp.charAt(6) === '-') { e.subtract(easterComp.substring(7), 'days'); }
                    if (easterComp.charAt(6) === '+') { e.add(easterComp.substring(7), 'days'); }

                    if (easterComp === 1) { return e; }
                    ds.push(e.format('M/D'));
                } else {
                    ds.push(easterComp);
                }
            }

            if (ds.length) { return ds.join('|'); }
        }
    }


    static parserExtensions = [
        ParseHoliday.EasterParser
    ];

    static parse(date: string, adjust: boolean) {
        var days = [], pd;

        for (var i = 0; i < ParseHoliday.parserExtensions.length; i++) {
            var pe = ParseHoliday.parserExtensions[i](date);
            if (pe || pe === false) { pd = pe; }
        }

        if (pd === false) { return false; } 
        if (typeof pd === 'string') { date = pd; } else if (pd) { days = pd; }

        if (!moment.isMoment(days) && !days.length && date.charAt(0).match(/[0-9(]/)) {
            var range = false;
            var dates = date.split('|');

            if (dates.length > 1) { range = true; }
            if (dates.length > 2) { dates = [dates[0], dates[1]]; }

            for (var i = 0; i < dates.length; i++) {
                var m = moment();
                var ds = dates[i].split('/');

                if (ds.length === 1 || (ds.length === 2 && ds[1].charAt(0) !== '(' && ds[1].length === 4)) {
                    var td = dates[i];
                    i = -1;
                    dates = [];
                    for (var ii = 1; ii < 13; ii++) { dates.push(ii + '/' + td); }
                    continue;
                }

                if (ds.length > 2) { m.year(parseInt(ds[2])); }

                m.month((parseInt(ds[0]) - 1));

                if (ds[1].charAt(0) === '(') {
                    var w = ds[1].slice(1, -1).split(',');
                    var wd = parseInt(w[0]);
                    var dt = parseInt(w[1]);
                    var d = moment(m).startOf('month');
                    var limit = (moment(m).endOf('month').diff(d, 'days') + 1);
                    var wds = [];

                    if (w[1] && w[1].charAt(0) === '[') {
                        var forward = true;
                        dt = parseInt(w[1].slice(1, -1));

                        if (dt < 0) {
                            forward = false;
                            dt = parseInt(w[1].slice(2, -1));
                        }

                        d = moment(m).date(dt);

                        for (var wi = 0; wi < 7; wi++) {
                            if (d.day() === wd) { days.push(moment(d)); break; }

                            if (forward) {
                                d.add(1, 'day');
                            } else {
                                d.subtract(1, 'day');
                            }
                        }

                        continue;
                    }

                    for (var ai = 0; ai < limit; ai++) {
                        if (d.day() === wd) { wds.push(moment(d)); }
                        d.add(1, 'day');
                    }

                    if (!dt) {
                        days = days.concat(wds);
                        continue;
                    } else if (dt < 0) {
                        m = wds[wds.length + dt];
                    } else {
                        m = wds[dt - 1];
                    }

                    days.push(m);
                } else {
                    days.push(m.date(parseInt(ds[1])));
                }
            }

            if (range && days.length > 1) {
                var diff = days[1].diff(days[0], 'days');

                if (diff > 1) {
                    var di = moment(days[0]);
                    days = [days[0]];

                    for (var i = 0; i < diff; i++) {
                        di.add(1, 'day');
                        days.push(moment(di));
                    }
                }
            }
        }

        days = arrayify(days);

        for (var i = 0; i < days.length; i++) {
            if (!moment.isMoment(days[i])) { delete (days[i]); continue; }

            if (adjust) {
                if (days[i].day() === 0) { days[i] = days[i].add(1, 'day'); }
                if (days[i].day() === 6) { days[i] = days[i].subtract(1, 'day'); }
            }

            days[i] = days[i].startOf('day');
        }

        if (!days.length) { return false; }
        //for now, only return a moment object
        return days[0]._d;
        
        //if (days.length === 1) { return days[0]; }

        //return days;
    }   
}

(window as any).parseHolidayz = ParseHoliday.parse;