var STYLE_STRING = "margin: 0; border: 1px solid #ddd; background-color: " +
                   "#f8f8f8; border-radius: 3px; padding: 0 3px;" +
                   "font-family: Consolas, monospace; font-size: 0.9em;" +
                   "display: inline-block";

function getParent(start, nodeName, className) {
    cur = start;
    while (cur) {
        if (cur.nodeName == nodeName && cur.className == className)
            return cur;
        cur = cur.parentNode;
    }
    return null;
}

function deleteEmptyParent(node) {
    cur = node
    while (cur && cur.parentNode) {
        if ((cur.nodeName == "CODE" && cur.className == "highlight-code" ||
             cur.nodeName == "SPAN" && cur.className == "un-highlight-code")
             && (cur.innerText == "" ||
                cur.innerText == " ")) {
            cur.parentNode.removeChild(cur);
            return;
        }
        cur = cur.parentNode;
    }
}

function recursiveAppend(to, from) {
    elements = from.childNodes
    while (elements.length) {
        el = elements[0];
        if (!(el.nodeName == "CODE" && el.className == "highlight-code") &&
            !(el.nodeName == "SPAN" && el.className == "un-highlight-code")) {
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

    sContainer = range.startContainer;
    eContainer = range.endContainer;

    range.deleteContents();

    deleteEmptyParent(sContainer);
    deleteEmptyParent(eContainer);

    return wrapper;
}

function doAction(add_code) {
    if (typeof window.getSelection != "undefined") {
        var selection = window.getSelection();
        if (selection.rangeCount) {
            for (var i = 0; i < selection.rangeCount; i++) {
                var range = selection.getRangeAt(i);
                parentCode = getParent(range.commonAncestorContainer, "CODE", "highlight-code");
                parentSpan = getParent(range.commonAncestorContainer, "SPAN", "un-highlight-code");
                if (add_code && parentCode) {
                    continue;
                }
                else if (!add_code) {
                    pl = getParent(range.startContainer, "CODE", "highlight-code");
                    pr = getParent(range.endContainer, "CODE", "highlight-code");

                    wrapper = document.createElement("span");

                    if (pl) {
                        while (pl.childNodes.length) {
                            wrapper.appendChild(pl.childNodes[0]);
                        }
                        pl.parentNode.removeChild(pl);
                    }

                    conts = range.extractContents();
                    recursiveAppend(wrapper, conts);

                    if (pr && pr != pl) {
                        while (pr.childNodes.length) {
                            wrapper.appendChild(pr.childNodes[0]);
                        }
                        pr.parentNode.removeChild(pr);
                    }

                    range.insertNode(wrapper);
                }
                else {
                    wrapper = codify(range, add_code)
                    if (wrapper.innerText != "")
                        range.insertNode(wrapper);
                }
            }
        }
    }
}

