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

function decode(m, e, n) {
    return m ** e % n
}

function encode(c, d, n) {
    return c ** d % n
}
