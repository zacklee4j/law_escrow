function stringToBytes32(str) {
    const buf = Buffer.alloc(32); // 32字节缓冲区
    const strBuf = Buffer.from(str, 'utf8');
    // 复制字符串内容，剩余部分补0
    strBuf.copy(buf, 0, 0, Math.min(strBuf.length, 32));
    return '0x' + buf.toString('hex');
  }

  module.exports = {
    stringToBytes32
  }