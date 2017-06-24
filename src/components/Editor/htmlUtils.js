function _getElementSubtitleLevel (htmlElement) {
    if (!htmlElement.tagName) {
        return;
    }
    const levelMatches = htmlElement.tagName.match(/^H([1-6])$/);
    return levelMatches && +levelMatches[1];
}

const allowedTagList = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'UL', 'OL', 'LI', 'IMG'];

export function getHTMLSemanticErrorList (htmlCollection = []) {
    htmlCollection = [].slice.call(htmlCollection);

    const elementIntegrityModel = {
        htmlElement: null,
        error:       null,
        errorLevel:  null,
    };

    let maxAllowedSubtitleLevel = 1;

    return htmlCollection.map(htmlElement => {
        const elementIntegrity = { ...elementIntegrityModel, htmlElement };

        // Transform text node in P tag
        if (!htmlElement.tagName) {
            const newChild = document.createElement('P');
            newChild.className = 'text';
            newChild.innerHTML = htmlElement.textContent;
            htmlElement.parentNode.replaceChild(newChild, htmlElement);
            elementIntegrity.htmlElement = newChild;
        }
        // Check allowed tags
        else if (!~allowedTagList.indexOf(htmlElement.tagName)) {
            elementIntegrity.errorLevel = 'warning';
            elementIntegrity.error = `Unsupported tag name ${htmlElement.tagName}`;
        }
        // Check title level integrity
        else {
            const subtitleLevel = _getElementSubtitleLevel(htmlElement);
            if (subtitleLevel) {
                if (subtitleLevel <= maxAllowedSubtitleLevel) {
                    maxAllowedSubtitleLevel = subtitleLevel + 1;
                }
                else if (subtitleLevel > maxAllowedSubtitleLevel) {
                    elementIntegrity.errorLevel = 'error';
                    elementIntegrity.error = `Level ${subtitleLevel} title not allowed here, no previous level ${maxAllowedSubtitleLevel} title.`
                }
            }
        }

        return elementIntegrity;
    });
}
