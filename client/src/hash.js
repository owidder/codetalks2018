// from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
function hex(buffer) {
    var hexCodes = [];
    var view = new DataView(buffer);
    for (var i = 0; i < view.byteLength; i += 4) {
        // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
        var value = view.getUint32(i)
        // toString(16) will give the hex representation of the number without padding
        var stringValue = value.toString(16)
        // We use concatenation and slice for padding
        var padding = '00000000'
        var paddedValue = (padding + stringValue).slice(-padding.length)
        hexCodes.push(paddedValue);
    }

    // Join all the hex strings into one
    return hexCodes.join("");
}

export const hashSHA512FromUtf8 = (utf8Text) => {

    return new Promise((resolve) => {
        const buffer = new TextEncoder("utf-8").encode(utf8Text);
        crypto.subtle.digest("SHA-512", buffer).then((hash) => {
            resolve(hex(hash));
        }, (e) => {
            console.log(e);
        })
    })
}
