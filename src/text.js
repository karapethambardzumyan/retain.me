import main from './main';

class Text {
  constructor() {

  };

  openToolbar(target) {
    const textToolbar = document.getElementById('text-toolbar');

    textToolbar.classList.remove('hidden');

    textToolbar.style.top = `${ target.top - textToolbar.offsetHeight - 14 }px`;
    textToolbar.style.left = `${ target.left }px`;

    document.getElementById('text').value = target.text;
  };

  closeToolbar() {
    const textToolbar = document.getElementById('text-toolbar');

    textToolbar.classList.add('hidden');
  };

  addAll() {
    fabric.util.enlivenObjects(main.config.texts, function(objects) {
      objects.forEach(o => {
        main.canvas.add(o);
        o.setControlsVisibility({
          ml: false,
          mt: false,
          mr: false,
          mb: false,
          mtr: false
        });
      });
    });
  };

  add(text) {
    let textObject = new fabric.Text(text, {
      fontSize: 14,
      fontFamily: 'Arial'
    });

    textObject.setControlsVisibility({
      ml: false,
      mt: false,
      mr: false,
      mb: false,
      mtr: false
    });

    main.canvas.add(textObject);
    main.canvas.setActiveObject(textObject);
    textObject.center();

    this.openToolbar(textObject);

    main.config.texts.push(textObject);
  };

  setSize(fontSize) {
    main.canvas.getActiveObject().set({ fontSize });
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setFamily(fontFamily) {
    main.canvas.getActiveObject().set({ fontFamily });
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setColor(color) {
    main.canvas.getActiveObject().setColor(color);
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setText(textValue) {
    main.canvas.getActiveObject().set({ text: textValue });
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };
};

const text = new Text();

export default text;
