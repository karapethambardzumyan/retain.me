const config = {
  canvas: {
    background: null,
    size: 0
  }
};

class Main {
  constructor() {
    if(localStorage.getItem('config') === null) {
      localStorage.setItem('config', JSON.stringify(config));
    }

    this.config = JSON.parse(localStorage.getItem('config'));
    this.ratio = window.devicePixelRatio;
    this.width = 400 * this.ratio;
    this.height = 400 * this.ratio;
  };

  run(cb) {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    return cb(this.config);
  };
};

const main = new Main();

export default main;
