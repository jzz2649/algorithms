# IEEE754

你遇到过已下问题吗

> 0.1 + 0.2 = 0.30000000000000004

## 说明

目前浏览器采用的64位来存储，这其中包括最高位64位的符号位，53-63位的指数位，以及1-52位的有效位，但由于除了0以外，其他数字首位都是1，所以52位不必保存这个1数字，所以计算机又多出了1位，共53位。我们所能安全表示的最大数位2**53-1。

## 精度

由于计算机采用的是2进制，唯一的质因数是2，所以能表示清楚的只有1/2、1/4、1/8，就如同10进制的质因数是2和5，所以1/2、1/4、1/5、1/8 和 1/10 都可以清楚地表达出来，因为分母都使用 10 的质因数。相反，1 /3、1/6、1/7 和 1/9 都是重复小数，因为它们的分母使用质因数3或7。所以在2进制中而 1/5 或 1/10 将重复小数。

## 格式

接下来通过douglascrockford的[`deconstruct`](https://github.com/douglascrockford/howjavascriptworks/blob/master/big_float.js#L297)来说明

> number = sign * coefficient * (2 ** exponent)

```
// 该函数返回符号位(sign)，系数(coefficient)，指数(exponent)
function deconstruct(number) {
    let sign = 1;
    let coefficient = number;
    let exponent = 0;
    // 获取符号位
    if (coefficient < 0) {
        coefficient = -coefficient;
        sign = -1;
    }

    if (Number.isFinite(number) && number !== 0) {
        // 由于位数有限，通过不断的除以2最终接近0，将指数从-1128开始得到正确的exponent，-1128就是Number.MIN_VALUE的指数减去有效位减去多余的1位得到的结果
        exponent = -1128;
        let reduction = coefficient;
        while (reduction !== 0) {
        // 不断除以2，来排除数据，得到正确的exponent
            exponent += 1;
            reduction /= 2;
        }
        // 通过是系数到0来得到正确的coefficient
        reduction = exponent;
        while (reduction > 0) {
            coefficient /= 2;
            reduction -= 1;
        }
        while (reduction < 0) {
            coefficient *= 2;
            reduction += 1;
        }
    }

    // 返回结果
    return {
        sign,
        coefficient,
        exponent,
        number
    };
}
```

未完待续...