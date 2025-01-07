const styles = {
    key: 'color: green;',
    string: 'color: yellow;',
    number: 'color: blue;',
    boolean: 'color: red;',
    null: 'color: magenta;'
};

function buildString(val, strArr, styleArr) {
    if (typeof val === 'string') {
        styleArr.push(styles.string);
        strArr.push('%c"' + val + '"');
    } else if (typeof val === 'number') {
        styleArr.push(styles.number);
        strArr.push('%c' + val);
    } else if (typeof val === 'boolean') {
        styleArr.push(styles.boolean);
        strArr.push('%c' + val);
    } else if (val === null) {
        styleArr.push(styles.null);
        strArr.push('%cnull');
    } else if (Array.isArray(val)) {
        strArr.push('[');
        for (let i = 0; i < val.length; i++) {
            if (i > 0) strArr.push(', ');
            buildString(val[i], strArr, styleArr);
        }
        strArr.push(']');
    } else if (typeof val === 'object' && val !== null) {
        strArr.push('{');
        const keys = Object.keys(val);
        for (let i = 0; i < keys.length; i++) {
            if (i > 0) strArr.push(', ');
            const key = keys[i];
            styleArr.push(styles.key);
            strArr.push('%c"' + key + '"');
            strArr.push(': ');
            buildString(val[key], strArr, styleArr);
        }
        strArr.push('}');
    }
}

function highlightJSON(jsonObj) {
    const strArr = [];
    const styleArr = [];
    buildString(jsonObj, strArr, styleArr);
    return [strArr.join(''), ...styleArr];
}

module.exports = {
    highlightJSON
}