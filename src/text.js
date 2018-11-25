import main from './main';

class Text {
  constructor() {

  };

  add(text) {
    let textObject = new fabric.Text(text, {
      fontSize: 14,
      fontFamily: 'Arial'
    });

    textObject.setControlsVisibility({
      tl: false,
      tr: false,
      bl: false,
      br: false,
      ml: false,
      mt: false,
      mr: false,
      mb: false,
      mtr: false
    });

    main.canvas.add(textObject);
    main.canvas.setActiveObject(textObject);
    textObject.center();
  };

  setSize(fontSize) {
    main.canvas.getActiveObject().set({ fontSize });
    main.canvas.renderAll();
  };

  setFamily(fontFamily) {
    main.canvas.getActiveObject().set({ fontFamily });
    main.canvas.renderAll();
  };

  setColor(color) {
    main.canvas.getActiveObject().setColor(color);
    main.canvas.renderAll();
  };
};

const text = new Text();

export default text;
