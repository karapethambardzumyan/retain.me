import main from './main';
import { PT_TO_PX, TEXT_TOOLBAR } from './constants';

function insertAtCursor(input, textToInsert) {
  const value = input.value;
  const start = input.selectionStart;
  const end = input.selectionEnd;

  input.value = value.slice(0, start) + textToInsert + value.slice(end);
  input.selectionStart = input.selectionEnd = start + textToInsert.length;
}

class Text {
  constructor() {
    this.objectTops = null;
  };

  updateToolbar(styles) {
    const activeObject = main.canvas.getActiveObject();
    const position = activeObject && main.canvas.getActiveObject().textAlign ? main.canvas.getActiveObject().textAlign : TEXT_TOOLBAR.fontAlign;

    if(styles) {
      if(styles.underline) {
        document.getElementById('font-underline').classList.add('active');
      } else {
        document.getElementById('font-underline').classList.remove('active');
      }

      document.getElementById('font-align-left').classList.remove('active');
      document.getElementById('font-align-center').classList.remove('active');
      document.getElementById('font-align-right').classList.remove('active');

      document.getElementById('font-family').value = styles.fontFamily || TEXT_TOOLBAR.fontFamily;
      document.getElementById('font-size').value = styles.fontSize / PT_TO_PX || TEXT_TOOLBAR.fontSize;
      document.getElementById(`font-align-${ position }`).classList.add('active');
      document.getElementById('font-color-preview').style.background = styles.fill || TEXT_TOOLBAR.fontColor;
      document.getElementById('font-color-value').value = styles.fill || TEXT_TOOLBAR.fontColor;
      document.getElementById('font-color-value').innerHTML = styles.fill || TEXT_TOOLBAR.fontColor;
      document.getElementById('font-color').value = styles.fill || TEXT_TOOLBAR.fontColor;
    }
  }

  openToolbar(target) {
    const textToolbar = document.getElementById('text-toolbar');

    textToolbar.classList.remove('hidden');
    // textToolbar.style.top = `${ target.top - textToolbar.offsetHeight - 14 }px`; ??
    textToolbar.style.top = `${ target.top - textToolbar.offsetHeight - 100 }px`;
    textToolbar.style.left = `${ target.left + ((main.canvas.getActiveObject().width - textToolbar.offsetWidth) / 2) }px`;
  };

  closeToolbar() {
    const textToolbar = document.getElementById('text-toolbar');

    document.getElementById('font-template').setAttribute('disabled', true);

    textToolbar.classList.add('hidden');
  };

  resetToolbar() {
    const activeObject = main.canvas.getActiveObject();
    const position = activeObject && main.canvas.getActiveObject().textAlign ? main.canvas.getActiveObject().textAlign : TEXT_TOOLBAR.fontAlign;

    document.getElementById('font-align-left').classList.remove('active');
    document.getElementById('font-align-center').classList.remove('active');
    document.getElementById('font-align-right').classList.remove('active');

    document.getElementById('font-family').value = TEXT_TOOLBAR.fontFamily;
    document.getElementById('font-size').value = TEXT_TOOLBAR.fontSize;
    document.getElementById(`font-align-${ position }`).classList.add('active');
    document.getElementById('font-color-preview').style.background = TEXT_TOOLBAR.fontColor;
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
        o.set({
          transparentCorners: false,
          cornerColor: 'rgb(100,144,206)',
          cornerStyle: 'circle',
          cornerSize: 11,
          borderColor: 'rgb(100,144,206)',
          borderDashArray: [2, 3]
        });
        o.followingStyles = {};

        main.canvas.renderAll();
      });
    });
  };

  add(text) {
    let textObject = new fabric.Textbox(text, {
      fontSize: TEXT_TOOLBAR.fontSize * PT_TO_PX,
      fontFamily: TEXT_TOOLBAR.fontFamily,
      fontWeight: TEXT_TOOLBAR.fontWeight,
      alignText: TEXT_TOOLBAR.fontAlign,
      fill: TEXT_TOOLBAR.fontColor,
      text: TEXT_TOOLBAR.text,
      lineHeight: 1,
      width: 200,
      transparentCorners: false,
      cornerColor: 'rgb(100,144,206)',
      cornerStyle: 'circle',
      cornerSize: 11,
      borderColor: 'rgb(100,144,206)',
      borderDashArray: [2, 3],
      followingStyles: {}
    });

    textObject.setControlsVisibility({
      tl: false,
      tr: false,
      bl: false,
      br: false,
      mt: false,
      mb: false,
      mtr: true
    });

    main.canvas.add(textObject);
    main.canvas.setActiveObject(textObject);
    textObject.center();
    main.config.texts.push(textObject);

    this.openToolbar(textObject);
  };

  addTemplate(template, target) {
    const activeObject = main.canvas.getActiveObject();
    const pos = activeObject.get2DCursorLocation(activeObject.selectionStart);
    const stylesToBeApplied = activeObject._getStyleDeclaration(pos.lineIndex, pos.charIndex);

    if(!activeObject.isRTL) {
      if(activeObject.selectionStart === 0 && activeObject.selectionEnd === activeObject.text.length) {
        activeObject.insertChars(template, null, activeObject.selectionStart, activeObject.selectionEnd);
        activeObject.setSelectionStyles(stylesToBeApplied, 0, activeObject.text.length);
      } else {
        activeObject.insertChars(template, null, activeObject.selectionStart, activeObject.selectionEnd);
      }
    } else {
      if(activeObject.selectionStart === 0 && activeObject.selectionEnd === activeObject.text.length) {
        activeObject.insertChars(template, null, activeObject.selectionStart, activeObject.selectionEnd);
        activeObject.setSelectionStyles(stylesToBeApplied, 0, activeObject.text.length);
      } else {
        activeObject.insertChars(template, null, activeObject.selectionStart, activeObject.selectionEnd);
        activeObject.setSelectionStyles(stylesToBeApplied, activeObject.selectionStart, activeObject.selectionStart + template.length);
      }
    }

    main.canvas.renderAll();
    activeObject.setCoords();

    target.blur();
    main.canvas.getActiveObject().hiddenTextarea.focus();
    insertAtCursor(main.canvas.getActiveObject().hiddenTextarea, template);

    activeObject.setSelectionStart(activeObject.selectionStart + template.length);
    activeObject.setSelectionEnd(activeObject.selectionStart);

    main.canvas.renderAll();

    const textarea = main.canvas.getActiveObject().hiddenTextarea;

    if(textarea) {
      textarea.focus();
      textarea.value = main.canvas.getActiveObject().text;
    }
  };

  setFamily(fontFamily) {
    if(main.canvas.getActiveObject().selectionStart === main.canvas.getActiveObject().selectionEnd) {
      main.canvas.getActiveObject().followingStyles.fontFamily = fontFamily;
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontFamily });
    }

    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();

    const textarea = main.canvas.getActiveObject().hiddenTextarea;

    if(textarea) {
      textarea.focus();
      textarea.value = main.canvas.getActiveObject().text;
    }
  };

  setSize(fontSize) {
    if(main.canvas.getActiveObject().selectionStart === main.canvas.getActiveObject().selectionEnd) {
      main.canvas.getActiveObject().followingStyles.fontSize = fontSize * PT_TO_PX;
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontSize: fontSize * PT_TO_PX });
    }
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });

    const textarea = main.canvas.getActiveObject().hiddenTextarea;

    if(textarea) {
      textarea.focus();
      textarea.value = main.canvas.getActiveObject().text;
    }
  };

  setHeight(lineHeight) {
    main.canvas.getActiveObject().set({ lineHeight });
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });

    const textarea = main.canvas.getActiveObject().hiddenTextarea;

    if(textarea) {
      textarea.focus();
      textarea.value = main.canvas.getActiveObject().text;
    }
  };

  setWeight(fontWeight) {
    if(main.canvas.getActiveObject().selectionStart === main.canvas.getActiveObject().selectionEnd) {
      main.canvas.getActiveObject().followingStyles.fontWeight = fontWeight;
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontWeight });
    }
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });

    const textarea = main.canvas.getActiveObject().hiddenTextarea;

    if(textarea) {
      textarea.focus();
      textarea.value = main.canvas.getActiveObject().text;
    }
  };

  setAlign(textAlign) {
    main.canvas.getActiveObject().set({ textAlign });
    main.canvas.getActiveObject().setCoords();
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });

    const textarea = main.canvas.getActiveObject().hiddenTextarea;

    if(textarea) {
      textarea.focus();
      textarea.value = main.canvas.getActiveObject().text;
    }
  };

  setColor(fill) {
    if(main.canvas.getActiveObject().selectionStart === main.canvas.getActiveObject().selectionEnd) {
      main.canvas.getActiveObject().followingStyles.fill = fill;
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fill });
    }
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });

    const textarea = main.canvas.getActiveObject().hiddenTextarea;

    if(textarea) {
      textarea.focus();
      textarea.value = main.canvas.getActiveObject().text;
    }
  };

  setUnderline(underline) {
    if(main.canvas.getActiveObject().selectionStart === main.canvas.getActiveObject().selectionEnd) {
      main.canvas.getActiveObject().followingStyles.underline = !underline;
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ underline: !underline });
    }
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });

    const textarea = main.canvas.getActiveObject().hiddenTextarea;

    if(textarea) {
      textarea.focus();
      textarea.value = main.canvas.getActiveObject().text;
    }
  };

  setUppercase() {
    const activeObject = main.canvas.getActiveObject();

    let selectionStart = activeObject.selectionStart === activeObject.selectionEnd ? 0 : activeObject.selectionStart;
    let selectionEnd = activeObject.selectionStart === activeObject.selectionEnd ? main.canvas.getActiveObject().text.length : activeObject.selectionEnd;
    let selectedChars = main.canvas.getActiveObject().text.substring(selectionStart, selectionEnd);

    selectedChars = selectedChars.toUpperCase();

    activeObject.insertChars(selectedChars, activeObject.getSelectionStyles(selectionStart, selectionEnd), selectionStart, selectionEnd);
    main.canvas.renderAll();
    activeObject.setCoords();

    const textarea = main.canvas.getActiveObject().hiddenTextarea;

    if(textarea) {
      textarea.focus();
      textarea.value = main.canvas.getActiveObject().text;
    }
  };

  setCamelcase() {
    const activeObject = main.canvas.getActiveObject();

    let selectionStart = activeObject.selectionStart === activeObject.selectionEnd ? 0 : activeObject.selectionStart;
    let selectionEnd = activeObject.selectionStart === activeObject.selectionEnd ? main.canvas.getActiveObject().text.length : activeObject.selectionEnd;
    let selectedChars = main.canvas.getActiveObject().text.substring(selectionStart, selectionEnd);

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

    const textarea = main.canvas.getActiveObject().hiddenTextarea;

    if(textarea) {
      textarea.focus();
      textarea.value = main.canvas.getActiveObject().text;
    }
  };
};

const text = new Text();

export default text;

// old draft start
// updateHorizontalAligment(target) {
//   const objects = [];
//   this.objectTops = [];
//
//   for(let i in main.canvas.getObjects()) {
//     if(main.canvas.getObjects()[i].type === 'textbox') {
//       objects.push({
//         heights: main.canvas.getObjects()[i].__lineHeights,
//         top: main.canvas.getObjects()[i].top
//       });
//     }
//   }
//
//   for(let i in objects) {
//     for(let j in objects[i].heights) {
//       this.objectTops.push(objects[i].heights[j] * (Number(j) + 1) + objects[i].top);
//     }
//   }
// };
// old draft end
