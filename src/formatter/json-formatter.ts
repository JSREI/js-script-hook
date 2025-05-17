interface Styles {
    key: string;
    string: string;
    number: string;
    boolean: string;
    null: string;
}

const styles: Styles = {
    key: 'color: green;',
    string: 'color: yellow;',
    number: 'color: blue;',
    boolean: 'color: red;',
    null: 'color: magenta;'
};

function buildString(val: any, strArr: string[], styleArr: string[]): void {
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

/**
 * 将JSON对象转换为带有语法高亮的格式化字符串
 * @param jsonObj - 要格式化的JSON对象
 * @returns 返回一个数组，第一个元素是格式化后的字符串，后面的元素是样式数组
 */
export function highlightJSON(jsonObj: any): string[] {
    const strArr: string[] = [];
    const styleArr: string[] = [];
    buildString(jsonObj, strArr, styleArr);
    return [strArr.join(''), ...styleArr];
} 