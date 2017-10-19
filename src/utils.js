export function calcWidth(element, dir) {
    let dom;
    if (typeof element === 'string') {
        dom = document.querySelectorAll(element);
    } else {
        dom = element
    }
    dom = Array.prototype.slice.call(dom, 0)
    let maxWidth = 0;
    dom.forEach(each => {
        const offsetWidth = each.offsetWidth;
        if (offsetWidth > maxWidth) {
            maxWidth = offsetWidth;
        }
    })
    dom.forEach(each => {
        // each.parentNode.style.width = 'initial';
        each.parentNode.style.width = maxWidth + 'px';
    })
}

export function addResizeEventListener(ele, resizeHandle) {
    const obj = document.createElement('object');
    obj.setAttribute('style', 'position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;');
    obj.onload = () => {
        obj.contentDocument.defaultView.addEventListener('resize', resizeHandle, false)
    };
    obj.type = 'text/html';
    ele.appendChild(obj);
    obj.data = 'about:blank';
    return obj;
}