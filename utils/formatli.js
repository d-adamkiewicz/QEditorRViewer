export function adjustToLeft(str, sLimit) {
    return fmtParts('right', str, sLimit);
}

export function adjustToRight(str, sLimit) {
    return fmtParts('left', str, sLimit);
}

function lastSep(str) {
    var last;
    if ((last = str.lastIndexOf(","))==-1) {
        if ((last = str.lastIndexOf(" "))==-1) {
            if ((last = str.lastIndexOf("-"))!=-1) {
                last += 1;
            }
        }
    } 
    // last=-1 or ","," ","-" position
    return last;
}

function getLastSep(str) {
    var last;
    if ((last = str.lastIndexOf(","))!=-1) {
        return last;
    }
    if ((last = str.lastIndexOf(" "))!=-1) {
        return last;
    }
    if ((last = str.lastIndexOf("-"))!=-1) {
        return last;
    }
    // last=-1 or ","," ","-" position
    return last;
}

function fmtParts(dir /*direction*/, str, sLimit) {
    var conStr = str==null?'':str.toString()
        , varStr = conStr
        , rest = ''
        , last = 0;
// if undefined set length to 20 characters
    if (typeof sLimit == "undefined") {
        sLimit = 20;
    }                           
    if (conStr.length > sLimit) {
        while(varStr.length > sLimit-4) {
            last = getLastSep(varStr);
            /*
             If length is 0 or negative, substr returns an empty string. 
             If length is omitted, substr extracts characters to the end of the string.
            */
            varStr = conStr.substr(0, last);
            //console.log(varStr + " " + varStr.length + " " + sLimit);
        }
        var len = sLimit - last;
        len -= 4;
        //rest = conStr.substr(last + 1);
        rest = conStr.substr(last + 1);
        //return  varStr + ' <a href="#" title="' + rest + '">...</a>' + padRight('',len);
        //reserve 5 chars for [space][...][space]
        if (varStr) {
            ++len;
        }
        return [varStr, rest, padRight('', len)];
    }
    if (conStr.length == 0) {
        return [dir == 'right' ? padRight('-', sLimit) : padLeft('-', sLimit)];
    } else {
        // console.log('show:' + padRight(str, sLimit));
        return [dir == 'right' ? padRight(conStr, sLimit) : padLeft(conStr, sLimit)];
    }
}

function formatStrLI(dir /*direction*/, str, sLimit) {
    var lStr = str.toString()
        , li = lStr
        , rest = ''
        , last = 0;
// if undefined set length to 20 characters
    if (typeof sLimit == "undefined") {
        sLimit = 20;
    }                           
    if (lStr.length > sLimit) {
        while(li.length>sLimit-4) {
            last = lastSep(li);
            /*
             If length is 0 or negative, substr returns an empty string. 
             If length is omitted, substr extracts characters to the end of the string.
            */
            li = lStr.substr(0, last);
            //console.log(li + " " + li.length + " " + sLimit);
        }
        var len = sLimit - last;
        len -= 4;
        rest = lStr.substr(last + 1);
        return  li + ' <a href="#" title="' + rest + '">...</a>' + padRight('',len);
    }
    if (lStr.length == 0) {
        return dir == 'right' ? padRight('-', sLimit) : padLeft('-', sLimit);
    } else {
        // console.log('show:' + padRight(str, sLimit));
        return dir == 'right' ? padRight(lStr, sLimit) : padLeft(lStr, sLimit);
    }
}

function pad(dir, str, sLimit, padWith) {
    if (typeof sLimit == "undefined") {
        sLimit = 20;
    }       
    if (typeof padWith == "undefined") {
    // for React unicode representation of '&nsbp;'
        padWith = '\u00A0';
    }
    // important
    var lStr = str.toString()
        , len = lStr.length
        , pad = '';
    while(len<sLimit) {
        pad += padWith;
        len++;
    }
    return dir=='right' ? lStr + pad : pad + lStr;
}

function padRight(str, sLimit, padWith) {
    return  pad('right', str, sLimit, padWith);
}

function padLeft(str, sLimit, padWith) {
    return pad('left', str, sLimit, padWith);
}

