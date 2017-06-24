function _getElementSubtitleLevel (htmlElement) {
    if (!htmlElement.tagName) {
        return;
    }
    const levelMatches = htmlElement.tagName.match(/^H([1-9]\d*)$/);
    return levelMatches && +levelMatches[1];
}

export function getHTMLSemanticErrorList (htmlCollection = []) {
    htmlCollection = [].slice.call(htmlCollection);

    const elementIntegrityModel = {
        htmlElement: null,
        error:       null
    };

    let maxAllowedSubtitleLevel = 1;

    return htmlCollection.map(htmlElement => {
        let elementIntegrity = { ...elementIntegrityModel, htmlElement };

        // Check integrity according to element tag name
        // =============================================

        // Check subtitle level integrity
        const subtitleLevel = _getElementSubtitleLevel(htmlElement);
        if (subtitleLevel) {
            if (subtitleLevel <= maxAllowedSubtitleLevel) {
                maxAllowedSubtitleLevel = subtitleLevel + 1;
            }
            else if (subtitleLevel > maxAllowedSubtitleLevel) {
                // Error
                elementIntegrity.error = `Level ${subtitleLevel} title not allowed here, no previous level ${maxAllowedSubtitleLevel} title.`
            }
        }

        return elementIntegrity;
    });
}
