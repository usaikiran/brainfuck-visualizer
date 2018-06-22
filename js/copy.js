
function copyToClipboard( text ) 
{
  var textarea = document.createElement('textarea');
  textarea.value = text;

  document.body.appendChild( textarea );
  
  disableScroll();

  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) 
  {
    const editable = textarea.contentEditable;
    textarea.contentEditable = true;
    const range = document.createRange();
    range.selectNodeContents(textarea);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    textarea.setSelectionRange(0, 999999);
    textarea.contentEditable = editable;
  } 
  else 
  {
    textarea.select();
    document.execCommand('copy');
  }
  clearSelection();
  document.body.removeChild( textarea );
  enableScroll();
}

function clearSelection() {
  var sel;
  if ( (sel = document.selection) && sel.empty ) {
      sel.empty();
  } else {
      if (window.getSelection) {
          window.getSelection().removeAllRanges();
      }
      var activeEl = document.activeElement;
      if (activeEl) {
          var tagName = activeEl.nodeName.toLowerCase();
          if ( tagName == "textarea" ||
                  (tagName == "input" && activeEl.type == "text") ) {
              // Collapse the selection to the end
              activeEl.selectionStart = activeEl.selectionEnd;
          }
      }
  }
}

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}