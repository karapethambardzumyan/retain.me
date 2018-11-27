import main from './main';
import { TEXT_TOOLBAR } from './constants';

class Text {
  constructor() {

  };

  updateToolbar(styles) {
    document.getElementById('font-family').value = styles.fontFamily || TEXT_TOOLBAR.fontFamily;
    document.getElementById('font-size').value = styles.fontSize || TEXT_TOOLBAR.fontSize;
    document.getElementById('font-weight').value = styles.fontWeight || TEXT_TOOLBAR.fontWeight;
    document.getElementById('font-align').value = styles.alignText || TEXT_TOOLBAR.fontAlign;
    document.getElementById('font-color').value = styles.fill || TEXT_TOOLBAR.fontColor;
    document.getElementById('font-size-value').innerHTML = `${ styles.fontSize || TEXT_TOOLBAR.fontSize }px`;
    document.getElementById('font-color-value').innerHTML = styles.fill || TEXT_TOOLBAR.fontColor;
  }

  openToolbar(target) {
    const textToolbar = document.getElementById('text-toolbar');

    this.resetToolbar();

    textToolbar.classList.remove('hidden');
    textToolbar.style.top = `${ target.top - textToolbar.offsetHeight - 14 }px`;
    textToolbar.style.left = `${ target.left + ((main.canvas.getActiveObject().width - textToolbar.offsetWidth) / 2) }px`;
  };

  closeToolbar() {
    console.log(2);
    const textToolbar = document.getElementById('text-toolbar');

    textToolbar.classList.add('hidden');
  };

  resetToolbar() {
    console.log(3);
    document.getElementById('font-family').value = TEXT_TOOLBAR.fontFamily;
    document.getElementById('font-size').value = TEXT_TOOLBAR.fontSize;
    document.getElementById('font-weight').value = TEXT_TOOLBAR.fontWeight;
    document.getElementById('font-align').value = TEXT_TOOLBAR.fontAlign;
    document.getElementById('font-color').value = TEXT_TOOLBAR.fontColor;
    document.getElementById('font-size-value').innerHTML = `${ TEXT_TOOLBAR.fontSize }px`;
    document.getElementById('font-color-value').innerHTML = TEXT_TOOLBAR.fontColor;
  };

  addAll() {
    fabric.util.enlivenObjects(main.config.texts, function(objects) {
      objects.forEach(o => {
        main.canvas.add(o);
        o.setControlsVisibility({
          tl: false,
          tr: false,
          bl: false,
          br: false,
          mt: false,
          mb: false,
          mtr: false
        });
      });
    });
  };

  add(text) {
    let textObject = new fabric.Textbox(text, {
      fontSize: TEXT_TOOLBAR.fontSize,
      fontFamily: TEXT_TOOLBAR.fontFamily,
      fontWeight: TEXT_TOOLBAR.fontWeight,
      alignText: TEXT_TOOLBAR.fontAlign,
      fill: TEXT_TOOLBAR.fontColor,
      text: TEXT_TOOLBAR.text,
      width: 400
    });

    textObject.setControlsVisibility({
      tl: false,
      tr: false,
      bl: false,
      br: false,
      mt: false,
      mb: false,
      mtr: false
    });

    main.canvas.add(textObject);
    main.canvas.setActiveObject(textObject);
    textObject.center();

    this.openToolbar(textObject);

    main.config.texts.push(textObject);
  };

  setFamily(fontFamily) {
    if(main.canvas.getActiveObject().selectionStart === main.canvas.getActiveObject().selectionEnd) {
      main.canvas.getActiveObject().setSelectionStyles({ fontFamily }, 0, main.canvas.getActiveObject().text.length);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontFamily });
    }
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setSize(fontSize) {
    if(main.canvas.getActiveObject().selectionStart === main.canvas.getActiveObject().selectionEnd) {
      main.canvas.getActiveObject().setSelectionStyles({ fontSize }, 0, main.canvas.getActiveObject().text.length);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontSize });
    }
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setWeight(fontWeight) {
    if(main.canvas.getActiveObject().selectionStart === main.canvas.getActiveObject().selectionEnd) {
      main.canvas.getActiveObject().setSelectionStyles({ fontWeight }, 0, main.canvas.getActiveObject().text.length);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontWeight });
    }
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setAlign(textAlign) {
    main.canvas.getActiveObject().set({ textAlign });
    main.canvas.getActiveObject().setCoords();
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setColor(fill) {
    if(main.canvas.getActiveObject().selectionStart === main.canvas.getActiveObject().selectionEnd) {
      main.canvas.getActiveObject().setSelectionStyles({ fill }, 0, main.canvas.getActiveObject().text.length);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fill });
    }
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };
};

const text = new Text();

export default text;
