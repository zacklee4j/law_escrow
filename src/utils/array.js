function chunkArray(arr, size) {
    return arr.length > size 
      ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] 
      : [arr];
  }
  
  function uniqueArray(arr) {
    return [...new Set(arr)];
  }
  
  module.exports = {
    chunkArray,
    uniqueArray
  };