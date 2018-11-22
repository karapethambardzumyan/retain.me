class Main {
  constructor() {
    this.ratio = window.devicePixelRatio;
    this.width = 400 * this.ratio;
    this.height = 400 * this.ratio;
  };

  run(cb) {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    return cb();
  };
};

const main = new Main();

export default main;
