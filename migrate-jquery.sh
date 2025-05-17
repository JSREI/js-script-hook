#!/bin/bash

# 查找所有引用jquery-adapter的文件
FILES=$(find /Users/cc11001100/github/JSREI/js-script-hook/src -type f -name "*.ts" | xargs grep -l "jquery-adapter")

# 替换所有文件中的jQuery引用为原生DOM API
for FILE in $FILES; do
    echo "处理文件: $FILE"
    
    # 替换引入语句
    sed -i '' 's/import { jQuery as \$, JQuery } from .*.\/utils\/jquery-adapter.*/import { dom } from "..\/..\/..\/..\/utils\/dom-utils";/g' "$FILE"
    sed -i '' 's/import { jQuery as \$ } from .*.\/utils\/jquery-adapter.*/import { dom } from "..\/..\/..\/..\/utils\/dom-utils";/g' "$FILE"
    
    # 替换JQuery类型为HTMLElement
    sed -i '' 's/JQuery<HTMLElement>/HTMLElement/g' "$FILE"
    sed -i '' 's/: JQuery</: HTMLElement/g' "$FILE"
    
    # 替换$()选择器为document.querySelector()或document.createElement()
    sed -i '' 's/\$(\(.*\))/dom(\1)/g' "$FILE"
    
    # 替换常见的jQuery方法为原生DOM方法
    sed -i '' 's/\.on(/\.addEventListener(/g' "$FILE"
    sed -i '' 's/\.off(/\.removeEventListener(/g' "$FILE"
    sed -i '' 's/\.append(/\.appendChild(/g' "$FILE"
    sed -i '' 's/\.html(/\.innerHTML = /g' "$FILE"
    sed -i '' 's/\.addClass(/\.classList.add(/g' "$FILE"
    sed -i '' 's/\.removeClass(/\.classList.remove(/g' "$FILE"
    sed -i '' 's/\.toggleClass(/\.classList.toggle(/g' "$FILE"
    sed -i '' 's/\.attr(\([^,]*\))/\.getAttribute(\1)/g' "$FILE"
    sed -i '' 's/\.attr(\([^,]*\), \(.*\))/\.setAttribute(\1, \2)/g' "$FILE"
    sed -i '' 's/\.css(\([^,]*\), \(.*\))/\.style.setProperty(\1, \2)/g' "$FILE"
    
    echo "完成处理: $FILE"
done

echo "所有文件处理完毕" 