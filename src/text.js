import main from './main';
import { TEXT_TOOLBAR } from './constants';

function insertAtCursor(input, textToInsert) {
  console.log(input, textToInsert);
  const value = input.value;
  const start = input.selectionStart;
  const end = input.selectionEnd;

  input.value = value.slice(0, start) + textToInsert + value.slice(end);
  input.selectionStart = input.selectionEnd = start + textToInsert.length;
}

class Text {
  constructor() {

  };

  updateToolbar(styles) {
    const activeObject = main.canvas.getActiveObject();
    const position = activeObject && activeObject.textAlign ? activeObject.textAlign : TEXT_TOOLBAR.fontAlign;

    styles = styles.filter(style => Object.keys(style).length !== 0)[0] || {};

    if(styles.underline) {
      document.getElementById('font-underline').classList.add('active');
    } else {
      document.getElementById('font-underline').classList.remove('active');
    }

    document.getElementById('font-align-left').classList.remove('active');
    document.getElementById('font-align-center').classList.remove('active');
    document.getElementById('font-align-right').classList.remove('active');

    document.getElementById('font-family').value = styles.fontFamily || TEXT_TOOLBAR.fontFamily;
    document.getElementById('font-size').value = styles.fontSize || TEXT_TOOLBAR.fontSize;
    document.getElementById('font-weight').value = styles.fontWeight || TEXT_TOOLBAR.fontWeight;
    document.getElementById(`font-align-${ position }`).classList.add('active');
    document.getElementById('font-color').value = styles.fill || TEXT_TOOLBAR.fontColor;
    document.getElementById('font-color-value').value = styles.fill || TEXT_TOOLBAR.fontColor;
    document.getElementById('font-size-value').innerHTML = `${ styles.fontSize || TEXT_TOOLBAR.fontSize }px`;
    document.getElementById('font-color-value').innerHTML = styles.fill || TEXT_TOOLBAR.fontColor;
  }

  openToolbar(target) {
    const textToolbar = document.getElementById('text-toolbar');

    textToolbar.classList.remove('hidden');
    textToolbar.style.top = `${ target.top - textToolbar.offsetHeight - 14 }px`;
    textToolbar.style.left = `${ target.left + ((main.canvas.getActiveObject().width - textToolbar.offsetWidth) / 2) }px`;
  };

  closeToolbar() {
    const textToolbar = document.getElementById('text-toolbar');

    document.getElementById('font-template').setAttribute('disabled', true);

    textToolbar.classList.add('hidden');
  };

  resetToolbar() {
    const activeObject = main.canvas.getActiveObject();
    const position = activeObject && activeObject.textAlign ? activeObject.textAlign : TEXT_TOOLBAR.fontAlign;

    document.getElementById('font-align-left').classList.remove('active');
    document.getElementById('font-align-center').classList.remove('active');
    document.getElementById('font-align-right').classList.remove('active');

    document.getElementById('font-family').value = TEXT_TOOLBAR.fontFamily;
    document.getElementById('font-size').value = TEXT_TOOLBAR.fontSize;
    document.getElementById('font-weight').value = TEXT_TOOLBAR.fontWeight;
    document.getElementById(`font-align-${ position }`).classList.add('active');
    document.getElementById('font-color').value = TEXT_TOOLBAR.fontColor;
    document.getElementById('font-size-value').innerHTML = `${ TEXT_TOOLBAR.fontSize }px`;
    document.getElementById('font-color-value').innerHTML = TEXT_TOOLBAR.fontColor;
  };

  addAll() {
    fabric.util.enlivenObjects(main.config.texts, objects => {
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
    main.config.texts.push(textObject);

    this.openToolbar(textObject);
  };

  addTemplate(template, target) {
    const activeObject = main.canvas.getActiveObject();

    activeObject.insertChars(template, null, activeObject.selectionStart, activeObject.selectionStart);
    main.canvas.renderAll();
    activeObject.setCoords();

    target.blur();
    document.querySelector('textarea[data-fabric-hiddentextarea]').focus();
    insertAtCursor(document.querySelector('textarea[data-fabric-hiddentextarea]'), template);

    activeObject.setSelectionStart(activeObject.selectionStart + template.length);
    activeObject.setSelectionEnd(activeObject.selectionStart);

    main.canvas.renderAll();
  };

  setFamily(fontFamily) {
    if(main.canvas.getActiveObject().selectionStart === main.canvas.getActiveObject().selectionEnd) {
      main.canvas.getActiveObject().setSelectionStyles({ fontFamily }, 0, main.canvas.getActiveObject().text.length);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontFamily });
    }

    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
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

  setUnderline(underline) {
    if(main.canvas.getActiveObject().selectionStart === main.canvas.getActiveObject().selectionEnd) {
      main.canvas.getActiveObject().setSelectionStyles({ underline: !underline }, 0, main.canvas.getActiveObject().text.length);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ underline: !underline });
    }
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setUppercase() {
    const activeObject = main.canvas.getActiveObject();

    let selectionStart = activeObject.selectionStart === activeObject.selectionEnd ? 0 : activeObject.selectionStart;
    let selectionEnd = activeObject.selectionStart === activeObject.selectionEnd ? activeObject.text.length : activeObject.selectionEnd;
    let selectedChars = activeObject.text.substring(selectionStart, selectionEnd);

    selectedChars = selectedChars.toUpperCase();

    console.log('a:', selectionStart, selectionEnd, selectedChars);

    activeObject.insertChars(selectedChars, activeObject.getSelectionStyles(selectionStart, selectionEnd), selectionStart, selectionEnd);
    main.canvas.renderAll();
    activeObject.setCoords();

    const textarea = document.querySelector('textarea[data-fabric-hiddentextarea]');
    textarea.focus();
    textarea.value = activeObject.text;
  };

  setCamelcase() {
    const activeObject = main.canvas.getActiveObject();

    let selectionStart = activeObject.selectionStart === activeObject.selectionEnd ? 0 : activeObject.selectionStart;
    let selectionEnd = activeObject.selectionStart === activeObject.selectionEnd ? activeObject.text.length : activeObject.selectionEnd;
    let selectedChars = activeObject.text.substring(selectionStart, selectionEnd);

    selectedChars = selectedChars.split(' ');
    selectedChars = selectedChars.map(word => {
      word = word.toLowerCase();
      word = word[0].toUpperCase() + word.substring(1, word.length);

      return word;
    });
    selectedChars = selectedChars.join(' ');

    activeObject.insertChars(selectedChars, activeObject.getSelectionStyles(selectionStart, selectionEnd), selectionStart, selectionEnd);
    main.canvas.renderAll();
    activeObject.setCoords();

    const textarea = document.querySelector('textarea[data-fabric-hiddentextarea]');
    textarea.focus();
    textarea.value = activeObject.text;
  };
};

const text = new Text();

export default text;
