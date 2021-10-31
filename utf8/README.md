# UTF8

## 说明

这是目前采用较多的一个unicode编码实现格式，但大多数人对此了解却不是很熟悉

- unicode

计算机只会处理二进制，对于我们的书写文字，计算机不了解，所以我们要对每个字符加个数字编号(unicode)，这样根据编号，算计才能正确的处理这些字符，并展示。

- utf8

计算机是以字节存储，一个字节8位二进制，正好一位16进制可用4位二进制表示(11111111=>ff)。但是世界上各种国家使用各种语言，这样远远超出了当时计算机最初使用的ascii(英文国家)编码, 所以处理ascii(一个字节)以外的文字需要更多的字节，在英文国家，一个字节够用，采用更多字节造成内存浪费, 但中文需要更多字节,
所以出现了utf-8, utf-16, utf-32等等格式。接下来本文主要探讨utf-8的实现。

## utf8格式

> 一般3个字节够我们表示所有可书写字符(基本多文种平面BMP), 但utf8可最多支持6个字节，所以我们将实现所有utf8的格式

- 一个字节 0xxxxxxx
- 二个字节 110xxxxx 10xxxxxx
- 三个字节 1110xxxx 10xxxxxx 10xxxxxx
- 四个字节 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
- 五个字节 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
- 六个字节 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx

## 代码实现

```
// 定义utf的开头格式
const utf8 = [
    0b10000000,
    0b11000000,
    0b11100000,
    0b11110000,
    0b11111000,
    0b11111100
]

// 由于后续需要进行位移操作，且大于32位
// js本身的>> <<不支持32，所以我们自己实现位移操作

function rightShift(code, bit) {
    return Math.floor(code / Math.pow(2, bit))
}

function leftShift(code, bit) {
    return  code * Math.pow(2, bit)
}

// 由于我们需要把8二进制转换成2位16进制
// 可能会出现只有1位16进制，所以我们需要前面补全0

function pedUtf8(v) {
    return v.length % 2 ? '0' + v : v
}

// 把10进制转成16进制

function hex(code) {
    return code.toString(16)
}

// 我们需要根据utf8格式来判断字节的长度
// 从6位->1位依次判断字节的格式
// 只要大于或等于最高位(把xxx替换成0)即可取得结果

function getUtf8Bit(point) {
    const code = parseInt(point, 16)
    let bit = 6
    while(bit) {
        if (code >= utf8[bit-1]) {
            return bit
        }
        bit -= 1
    }
    return 1
}

// 把字符转换成对应的utf8编码格式的16进制表示
// 对于一个字节的，我们可以直接转化
// 对于二位及以上字节，除去最高的格式位，后面都是10xxxxxx格式
// 所以我们从最低位不断的通过左移6位来计算出16进制，再进行拼接

function utf8ToCode(point, bit) {
    const len = bit
    let code = 0
    if (bit === 1) {
        return parseInt(point, 16)
    }
    while(bit) {
        const u = point.substr(((len-bit)*2), 2)
        const a = len === bit ? utf8[bit-1] : 128
        code += leftShift(parseInt(u, 16) - a, (bit-1)*6)
        bit -= 1
    }
    return code
}

// 通过位运算，获取低位的编码
// 通过右移，左移来除去低位的数据得到高位
// 再通过原数据减去高位即可得到低位的数据

function belowBit(code, bit) {
    return code - leftShift(rightShift(code, bit), bit)
}

// 把对应utf8字节的有效部分(上面格式中的xxx)
// 拼接utf8前缀(10, 110等)组合成一个完整的字节位(10xxxxxx)

function codeToBit(code, bit) {
    return utf8[bit - 1] + code
}

// 对一组unicode编码转成对应的utf8格式

function utf8ify(codes) {
    return codes.map(code => {
        let bit = 1
        let s = ''
        while (bit < 7) {
            const validBit = bit === 1 ? 7 : 7 - bit
            if (code >= Math.pow(2, validBit)) {
                s = pedUtf8(hex(codeToBit(belowBit(code, 6), 1))) + s
                code = rightShift(code, 6)
            } else {
                if (bit === 1) {
                    return pedUtf8(hex(code))
                } else {
                    return hex(codeToBit(code, bit)) + s
                }
            }
            bit += 1
        }
        return s
    }).join('')
}

// 把utf8格式进行解析得到unicode

function parse(points) {
    let result = []
    const end = points.length
    let start = 0
    while (start < end) {
        const bit = getUtf8Bit(points.substr(start, 2))
        const point = points.substr(start, (bit * 2))
        result.push(utf8ToCode(point, bit))
        start += (bit * 2)
    }
    return result
}

```

### 使用示例
```
function toPoints(str) {
    return str.split('').map(s=>s.codePointAt())
}

function toChars(codes) {
    return codes.map(code=>String.fromCodePoint(code)).join('')
}

console.log(utf8ify(toPoints('这是一个例子')))
console.log(toChars(parse(utf8ify(toPoints('这是一个例子')))))

```
