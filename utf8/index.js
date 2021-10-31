const utf8 = [
    0b10000000,
    0b11000000,
    0b11100000,
    0b11110000,
    0b11111000,
    0b11111100
]

function rightShift(code, bit) {
    return Math.floor(code / Math.pow(2, bit))
}

function leftShift(code, bit) {
    return  code * Math.pow(2, bit)
}

function pedUtf8(v) {
    return v.length % 2 ? '0' + v : v
}

function hex(code) {
    return code.toString(16)
}

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

function belowBit(code, bit) {
    return code - leftShift(rightShift(code, bit), bit)
}

function codeToBit(code, bit) {
    return utf8[bit - 1] + code
}

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