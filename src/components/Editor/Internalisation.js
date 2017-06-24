import localeFR from './languages/fr-FR.js'
import localeEN from './languages/en-EN.js'
import localeES from './languages/es-ES.js'

var locales = {
    'fr-FR': localeFR,
    'en-EN': localeEN,
    'es-ES': localeES

};

export default function (language) {
    var currentLanguage = language;

    return {

        locales: locales,
        setLangue: function (langue) {
            currentLanguage = langue;
        },
        getMsg: function (key, data) {
            var result = key.split('.').reduce((prevResult, subKey) => {
                    var result = prevResult[subKey];
                    return typeof result === 'undefined' ? key : result;
                }, locales[currentLanguage].messages),
                countKey,
                count,
                pluralKey,
                prop;

            if (typeof result === 'object' && !Array.isArray(result)) {
                // Handle plural
                // -------------
                for (countKey in result) {
                    count = data[countKey];
                    if (typeof count === 'undefined') {
                        throw Error(`Plural count key '${countKey}' is not defined for '${key}'`);
                    }

                    if (count > 1) {
                        pluralKey = 'many';
                    }
                    else if (parseInt(count, 10) === 1 || (!count && typeof result[countKey].zero === 'undefined')) {
                        pluralKey = 'one';
                    }
                    else {
                        pluralKey = 'zero';
                    }

                    result = result[countKey][pluralKey];
                    if (typeof result === 'undefined') {
                        throw Error(`Plural key '${pluralKey}' is not defined for '${key}.${countKey}'`);
                    }
                }
            }

            if (data) {
                for (prop in data) {
                    result = result.replace(':' + prop + ':', data[prop]);
                }
            }

            return result;
        },

        msgExists: function (key) {
            return key.split('.').every(key => locales[currentLanguage].messages[key]);
        }
    }
}
