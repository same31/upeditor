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
        tagName:     null,
        error:       {},
        errorLevel:  null,
    };

    let maxAllowedSubtitleLevel = 1;

    return htmlCollection.map(htmlElement => {
        const elementIntegrity = { ...elementIntegrityModel, htmlElement };

        // Transform text node in P tag
        if (!htmlElement.tagName) {
            const newChild     = document.createElement('P');
            newChild.className = 'text';
            newChild.innerHTML = htmlElement.textContent;
            htmlElement.parentNode.replaceChild(newChild, htmlElement);
            elementIntegrity.htmlElement = newChild;
        }
        else {
            // Add tag name info
            htmlElement.setAttribute('data-tag-name', htmlElement.tagName.toLowerCase());

            // Check allowed tags
            if (!~allowedTagList.indexOf(htmlElement.tagName)) {
                elementIntegrity.error      = {
                    level:   'warning',
                    message: 'errors.unsupportedTagName',
                    data:    {
                        tagName: htmlElement.tagName
                    }
                };
            }
            // Check title level integrity
            else {
                const subtitleLevel = _getElementSubtitleLevel(htmlElement);
                if (subtitleLevel) {
                    console.log(subtitleLevel);
                    console.log('max', maxAllowedSubtitleLevel);
                    if (subtitleLevel <= maxAllowedSubtitleLevel) {
                        maxAllowedSubtitleLevel = subtitleLevel + 1;
                    }
                    else {
                        elementIntegrity.error = {
                            level:   'error',
                            message: 'errors.titleLevelNotAllowed',
                            data:    {
                                subtitleLevel,
                                maxAllowedSubtitleLevel
                            }
                        }
                    }
                }
            }
        }

        return elementIntegrity;
    });
}
