import $ from 'jquery';

export function parseHTML (htmlContent) {
    return $.parseHTML(htmlContent);
}

function _getElementSubtitleLevel (htmlElement) {
    if (!htmlElement.tagName) {
        return;
    }
    const levelMatches = htmlElement.tagName.match(/^H([2-9]\d*)$/);
    return levelMatches && +levelMatches[1];
}

export function getHTMLSemanticErrorList (parsedHTML = []) {
    const elementIntegrityModel = {
        htmlElement: null,
        error:       null
    };

    const htmlSemanticErrorList = parsedHTML.map(htmlElement => {
        let elementIntegrity         = { ...elementIntegrityModel };
        elementIntegrity.htmlElement = htmlElement;
        elementIntegrity.error       = null;

        // Check integrity according to element tag name
        // =============================================
        // Checks are done on H2+
        const subtitleLevel = _getElementSubtitleLevel(htmlElement);
        if (subtitleLevel) {
            console.log(htmlElement.tagName, subtitleLevel);
        }
        return elementIntegrity;
    });

    return htmlSemanticErrorList;
}
