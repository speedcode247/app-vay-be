function randomIntByMinMax(min, max) {
    // min and max included
    let value = max;
    for (let i = 0; i < 100; i++) {
      value = Math.floor(Math.random() * (max - min + 1) + min);
    }
    return value;
  }

  module.exports = {
    randomIntByMinMax
  }