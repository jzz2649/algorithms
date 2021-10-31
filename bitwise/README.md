# 位运算

## 说明

\>\> \<\< & ｜ ^ 只能进行32位运算，超过32位会进行截断，且最高32位为符号位(1为负, 0位正)

```2**31 | 1 === -2147483647``` 

```2**31 << 1 === 0```

## 原理

计算机使用的二进制，每移动一位，相对增加或减少2的倍数

```1000 >> 2 => 10```

十进制表示

```8 / (2 ** 2) => 2```

```1000 << 2 => 100000```

十进制表示

```8 * (2 ** 2) => 32```

由上可知，当我们需要左移或右移n位时，我们只需要乘以或着除以2的n次方得到的结果去除小数部分便是最终结果

## 代码实现

### 位移

- 右移

```
function rightShift(code, bit) {
  return Math.floor(code / Math.pow(2, bit))
}
```

- 左移

```
function leftShift(code, bit) {
  return code * Math.pow(2, bit)
}
```

### 逻辑运算

> 对于 ｜ & ^我们把数据分成两部分处理, 低位31位处理，高位32位及以上处理，得到结果后进行拼接得到最终结果

- 或运算

```
function and(a, b) {
  const aboveA = rightShift(a, 31)
  const aboveB = rightShift(b, 31)
  const belowA = a - leftShift(aboveA, 31)
  const belowB = b - leftShift(aboveB, 31)
  return leftShift(aboveA | aboveB, 31) + (belowA | belowB)
}
```

- 与运算

```
function or(a, b){
  const aboveA = rightShift(a, 31)
  const aboveB = rightShift(b, 31)
  const belowA = a - leftShift(aboveA, 31)
  const belowB = b - leftShift(aboveB, 31)
  return leftShift(aboveA & aboveB, 31) + (belowA & belowB)
}
```

- 异或运算
```
function xor(a, b) {
  const aboveA = rightShift(a, 31)
  const aboveB = rightShift(b, 31)
  const belowA = a - leftShift(aboveA, 31)
  const belowB = b - leftShift(aboveB, 31)
  return leftShift(aboveA ^ aboveB, 31) + (belowA ^ belowB)
}
```