/**
 * Translator: A minimal, dependency-free translation library.
 */
class Translator {
    /**
     * @param {string} initialLang - The initial language code (e.g., 'en').
     */
    constructor(initialLang = 'en') {
        this.currentLang = initialLang;
        this.translations = {};
    }

    /**
     * Loads the translation data. This object can be fetched from a JSON file,
     * an API, or generated from a database/CSV.
     * @param {object} translationsData - The object containing all language translations.
     */
    load(translationsData) {
        this.translations = translationsData;
    }

    /**
     * Sets the current language and re-renders the translations on the page.
     * @param {string} lang - The language code to switch to.
     */
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`Language "${lang}" not found in translations.`);
            return;
        }
        this.currentLang = lang;
        console.log(`Language changed to: ${lang}`);
        this.apply();
    }

    /**
     * Retrieves a translation string for a given key.
     * Handles nested keys (e.g., 'page.header.title').
     * @param {string} key - The translation key.
     * @param {object} [vars={}] - An object with placeholder values to replace.
     * @returns {string} The translated string or the key itself if not found.
     */
    get(key, vars = {}) {
        // Navigate through the nested object
        const langTranslations = this.translations[this.currentLang];
        if (!langTranslations) return key;

        let text = key.split('.').reduce((obj, i) => (obj ? obj[i] : null), langTranslations);
        
        if (!text) {
            console.warn(`Translation key "${key}" not found for language "${this.currentLang}".`);
            return key;
        }

        // Replace placeholders like {user} with values from the vars object
        for (const varName in vars) {
            const regex = new RegExp(`{${varName}}`, 'g');
            text = text.replace(regex, vars[varName]);
        }

        return text;
    }

    /**
     * Scans the DOM for elements with `data-translate` attributes and applies
     * the corresponding translations.
     */
    apply() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            
            // Check for variables in a separate data attribute
            let vars = {};
            const varsAttr = el.getAttribute('data-translate-vars');
            if (varsAttr) {
                try {
                    // Safely parse the JSON-like string
                    vars = JSON.parse(varsAttr);
                } catch (e) {
                    console.error(`Error parsing data-translate-vars for key "${key}":`, e);
                }
            }
            
            // To avoid a "flash" of untranslated content, we can fade it out and back in
            el.style.opacity = '0';
            setTimeout(() => {
                el.innerHTML = this.get(key, vars);
                el.style.opacity = '1';
            }, 150);
        });
    }
}
