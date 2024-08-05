function onChangeItterableElement(elementType, lastElementPlaceholder, enableEmptyValue, className) {
    const customFunction = function (e, el, parentElement) {
        const elementToAnimate = document.getElementById(parentElement)
        const { left, top } = window.getSelection().getRangeAt(0).getBoundingClientRect()
        createRipple(elementToAnimate, top, left)

        if (e.keyCode === 13) {
            e.preventDefault()
            if (el.innerText !== '') {
                const newElement = document.createElement(elementType)
                newElement.onkeydown = (e) => customFunction(e, newElement, parentElement)
                newElement.contentEditable = true
                if (className) {
                    newElement.classList.add(className)
                }
                const nextElement = el.nextElementSibling
                if (nextElement) {
                    el.parentNode.insertBefore(newElement, nextElement)
                } else {
                    el.parentNode.appendChild(newElement)
                }
                newElement.focus()
                return
            }
        } else if (e.keyCode === 8 && (enableEmptyValue && el.innerText === '' || !enableEmptyValue && el.innerText.length === 1)) {
            e.preventDefault()
            const prevEl = el.previousElementSibling
            if (prevEl) {
                prevEl.focus()
                setCursorAtTheEnd(prevEl)
            }
            if (el.parentNode.children.length > 1) {
                el.remove()
            } else {
                el.innerText = lastElementPlaceholder
                setCursorAtTheEnd(el)
            }
            return
        }
    }
    return customFunction
}

const onListItemChange = onChangeItterableElement('li', 'Type something', true, null)
const onChangeInterestsList = onChangeItterableElement('div', 'Add interest', true, 'more-section_interests_body_item')
const onChangeHashtagsList = onChangeItterableElement('div', 'Add hashtag', true, 'more-section_education_body_item_hashtags_item')

function createRipple(el, top, left) {
    const {x, y} = el.getBoundingClientRect()
    const circle = document.createElement("span");
    const diameter = Math.max(el.clientWidth, el.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${(left - x - radius)}px`;
    circle.style.top = `${(top - y - radius)}px`;
    circle.classList.add("ripple"); 
    el.appendChild(circle)
}

function setCursorAtTheEnd(el) {
    const range = document.createRange()
    const sel = window.getSelection()
    range.setStart(el.childNodes[0], el.childNodes[0].length)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
}

function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = (element.scrollHeight) + "px";
}

function setLanguageLevel(event, el) {
    const elementToAnimate = document.getElementById('language-levels')
    createRipple(elementToAnimate, event.clientY, event.clientX)
    const level = Math.floor((event.offsetX / el.clientWidth)*100)
    el.firstElementChild.dataset.level = level
    el.firstElementChild.style.width = level + '%'
}

document.addEventListener("readystatechange", () => {
    const allTextareas = document.getElementsByTagName('textarea')
    for (let i = 0; i < allTextareas.length; i++) {
        auto_grow(allTextareas[i])
    }

    const allLevels = document.getElementsByClassName('introduction-section_language_body_progressbar_content')
    for (let i = 0; i < allLevels.length; i++) {
        allLevels[i].style.width = allLevels[i].dataset.level + '%'
    }

    const allEditableEls = document.getElementsByClassName('has-placeholder')
    for (let i = 0; i < allEditableEls.length; i++) {
        allEditableEls[i].addEventListener("input", function(e) {
            const currentEl = allEditableEls[i]
            const elementToAnimate = document.getElementById(currentEl.dataset.parentElement)
            const { left, top } = window.getSelection().getRangeAt(0).getBoundingClientRect()
            createRipple(elementToAnimate, top, left)
            if (currentEl.innerText === '' && !e.data) {
                currentEl.innerText = currentEl.dataset.placeholder
            }
        }, false)
        allEditableEls[i].addEventListener("beforeinput", function(e) {
            const currentEl = allEditableEls[i]
            if (currentEl.innerText === currentEl.dataset.placeholder && e.data && e.data.length) {
                currentEl.innerText = ''
            }
        }, false)
    }
})

function downloadPDF() {
    const element = document.getElementById('cv')
    var opt = {
        margin:       0,
        filename:     'CV.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    html2pdf(element, opt)
}



