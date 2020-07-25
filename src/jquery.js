window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
    let elements
    if (typeof selectorOrArrayOrTemplate === 'string') {
        if (selectorOrArrayOrTemplate[0] === "<") {
            //创建div
            elements = [createElement(selectorOrArrayOrTemplate)];
        } else {
            //查找div
            elements = document.querySelectorAll(selectorOrArrayOrTemplate)
        }
    } else if (selectorOrArrayOrTemplate instanceof Array) {
        elements = selectorOrArrayOrTemplate
    }


    function createElement(string) {
        const container = document.createElement("template");
        container.innerHTML = string.trim();
        return container.content.firstChild;
    }
    //api 可以操作elements
    const api = Object.create(jQuery.prototype)  //创建一个对象，这个对象的__proto__为jQuery.prototype
    // const api = {__proto__:jQuery.prototype}
    Object.assign(api, {
        elements: elements,
        oldApi: selectorOrArrayOrTemplate.oldApi
    })
    //api.elements = elements
    //api.oldApi = selectorOrArrayOrTemplate.oldApi
    return api
};

jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    jQuery: true,
    get(index) {
        return this.elements[index];
    },
    appendTo(node) {
        if (node instanceof Element) {
            this.each(el => node.appendChild(el))
        } else if (node.jQuery === true) {
            this.each(el => node.get(0).appendChild(el))
        }
    },
    append(children) {
        if (children instanceof Element) {
            this.get(0).appendChild(children)
        } else if (children instanceof HTMLCollection) {
            for (let i = 0; i < children.length; i++) {
                this.get(0).appendChild(children[i])
            }
        } else if (children.jQuery === true) {
            children.each(node => this.get(0).appendChild(node))
        }
    },
    find(selector) {
        let array = []
        this.each((node) => {
            array.push(...node.querySelectorAll(selector))
        })
        array.oldApi = this  //this就是api  (api1)
        return jQuery(array)
    },
    each(fn) {
        for (let i = 0; i < elements.length; i++) {
            fn.call(null, elements[i], i)
        }
    },
    parent() {
        const array = []
        this.each((node) => {
            if (array.indexOf(node.parentNode) === -1) {
                array.push(node.parentNode)
            }
        })
        return jQuery(array)
    },
    children() {
        const array = []
        this.each((node, i) => {
            // console.log(...node.children, `children${i}`)
            array.push(...node.children)
        })
        return jQuery(array)
    },
    siblings() {
        let array = []
        this.each((node) => {
            let c = Array.from(node.parentNode.children)
            array = array.concat(c.filter(n => n !== node))
        })
        return jQuery(array)
    },
    index(selector) {
        let index
        if (selector) {
            this.each((node, i) => {
                if (node === document.querySelector(selector)) {
                    index = i
                }
            })
        } else {
            let children = [...elements[0].parentNode.children]
            index = children.indexOf(elements[0])
        }

        return index
    },
    print() {
        console.log(elements)
    },
    addClass(className) {
        this.each((node) => node.classList.add(className))
        return this
    },

    oldApi: selectorOrArray.oldApi,
    end() {
        return this.oldApi   //this是当前api(api2)
    }
}








