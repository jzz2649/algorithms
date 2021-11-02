# RSA算法

## 说明

> RSA是非对称加密算法，可逆。公钥[e, n]进行加密，私钥[e, n]进行解密。

## 代码实现

```
// keygen使用三个素数p, q, e生成私钥d
// p和q两个素数越大，安全性越高，性能越差
// e取小于(p - 1) * (q - 1)的素数及可
function keygen(p, q, e) {
	const n = p * q
	const l = (p - 1) * (q - 1);
	let k = 1
	while ((k * l + 1) % e !== 0) {
		k += 1;
	}
	let d = (k * l + 1) / e
	return [n, d]
}

// 加密，由于数据远超过2 ** 53 - 1, 所以建议使用BigInt, 解密同理
// 本文重在讲解实现原理，使用内置BigInt在外部传递
// 所以真正编码实现过程，请在decode中实现BigInt
function decode(m, e, n) {
    return m ** e % n
}
// 解密
function encode(c, d, n) {
    return c ** d % n
}
```

## 使用例子

```
// 需要加密的数据
const num = 1024
// 取两个素数
const p = 101
const q = 47
// 取e的值
const e = 109

// 生成私钥d
const [n, d] = keygen(p, q, e)

// 加密数据
const c = Number(decode(BigInt(num), BigInt(e), BigInt(n)))
console.log(c) // 3802
// 解密数据
const m = Number(encode(BigInt(c), BigInt(d), BigInt(n)))
console.log(m) // 1024
```