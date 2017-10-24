function $(selector, context=document) {
    return context.querySelector(selector);
}

function $$(selector, context=document) {
    return Array.from(context.querySelectorAll(selector));
}
