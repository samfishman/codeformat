var STYLE_STRING = "margin: 0; border: 1px solid #ddd; background-color: " +
                   "#f8f8f8; border-radius: 3px; padding: 0 3px;" +
                   "font-family: Consolas, monospace; font-size: 0.9em;" +
                   "display: inline-block";

function getParentCode(range) {
    cur = range.commonAncestorContainer;
    while (cur) {
        if (cur.nodeName == "CODE" && cur.className == "highlight-code")
            return cur;
        cur = cur.parentNode
    }
    return null;
}

function recursiveAppend(to, from) {
    elements = from.childNodes
    while (elements.length) {
        el = elements[0];
        if (el.nodeName != "CODE") {
            to.appendChild(elements[0]);
        }
        else {
            recursiveAppend(to, el);
            elements = from.childNodes;
            from.removeChild(elements[0]);
        }
    }
}

function codify(range) {
    conts = range.cloneContents();
    wrapper = document.createElement("code");

    wrapper.className = "highlight-code";
    wrapper.setAttribute("style", STYLE_STRING);
    if (typeof wrapper.style.setAttribute != "undefined")
        wrapper.style.setAttribute("cssText", STYLE_STRING); // IE Fix
    recursiveAppend(wrapper, conts);
    range.deleteContents();

    return wrapper;
}

if (typeof window.getSelection != "undefined") {
    var selection = window.getSelection();
    if (selection.rangeCount) {
        for (var i = 0; i < selection.rangeCount; i++) {
            var range = selection.getRangeAt(i);
            parentCode = getParentCode(range);
            if (parentCode) {
                continue;
            }
            else {
                range.insertNode(codify(range));
            }
        }
    }
}

