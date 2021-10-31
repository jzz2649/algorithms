function rightShift(code, bit) {
    return Math.floor(code / Math.pow(2, bit))
}

function leftShift(code, bit) {
    return code * Math.pow(2, bit)
}

function xor(a, b) {
    const aboveA = rightShift(a, 31)
    const aboveB = rightShift(b, 31)
    const belowA = a - leftShift(aboveA, 31)
    const belowB = b - leftShift(aboveB, 31)
    return leftShift(aboveA ^ aboveB, 31) + (belowA ^ belowB)
}

function and(a, b) {
    const aboveA = rightShift(a, 31)
    const aboveB = rightShift(b, 31)
    const belowA = a - leftShift(aboveA, 31)
    const belowB = b - leftShift(aboveB, 31)
    return leftShift(aboveA | aboveB, 31) + (belowA | belowB)
}

function or(a, b){
    const aboveA = rightShift(a, 31)
    const aboveB = rightShift(b, 31)
    const belowA = a - leftShift(aboveA, 31)
    const belowB = b - leftShift(aboveB, 31)
    return leftShift(aboveA & aboveB, 31) + (belowA & belowB)
}