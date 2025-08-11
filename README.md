# 🌐 Simple Translator
A minimal, dependency-free, vanilla JavaScript library for translating web page content. It's designed to be lightweight, easy to use, and flexible, allowing you to load translations from any source (JSON files, API endpoints, etc.).

## ✨ Features
* 🍦 **Vanilla JS:** No dependencies, no frameworks. Just pure JavaScript.
* 🗄️ **Flexible Data Source:** Load your translations from a simple JavaScript object. This means you can fetch them from a flat file (JSON, CSV) or an API connected to a database (SQL, NoSQL).
* 🔑 **Nested Keys:** Organize your translations logically with dot notation (e.g., page.header.title), keeping your files clean and readable.
* 🧩 **Placeholder Support:** Easily insert dynamic data into your translations (e.g., "Hello, {user}!").
* 🪶 **Lightweight:** Tiny footprint, perfect for projects where performance is key.

## 📦 Installation
Simply import the translator script and set it up.

translations.json:
```json
{
    "en": {
        "page": {
            "header": {
                "title": "Welcome!",
                "subtitle": "A simple translation library."
            }
        },
        "content": {
            "greeting": "Hello, {user}!"
        }
    },
    "es": {
        "page": {
            "header": {
                "title": "¡Bienvenido!",
                "subtitle": "Una librería de traducción simple."
            }
        },
        "content": {
            "greeting": "¡Hola, {user}!"
        }
    }
}
```

```javascript
import Translator from './translator.js';

// Import the JSON data directly using an import assertion
// Or you could load this from an api or database of some kind.
import translationsData from './translations.json' assert { type: 'json' };

// 1. Initialize the translator
const translator = new Translator('en');
translator.load(translationsData);

// 2. Apply translations on page load
document.addEventListener('DOMContentLoaded', () => {
    translator.apply();
});

// 3. Make the language switcher available to the HTML
// By attaching it to the window object, onclick can find it
window.setLang = function(lang) {
    translator.setLanguage(lang);
}
```

Mark up your HTML:
```html
<h1 data-translate="page.header.title"></h1>
<p data-translate="content.greeting" data-translate-vars='{"user": "Alex"}'></p>
<button onclick="setLang('es')">Español</button>
```

## 📊 CSV Example
You can also manage your translations in a spreadsheet and export it as a CSV file.

### Create your translations.csv file
The first column should be the key, and subsequent columns should be the language codes.

translations.csv:
```csv
key,en,es
page.header.title,"Welcome!","¡Bienvenido!"
page.header.subtitle,"A simple translation library.","Una librería de traducción simple."
content.greeting,"Hello, {user}!","¡Hola, {user}!"
```
### Fetch and Parse the CSV
Since the library requires a nested JSON object, you'll need a helper function to convert the flat CSV data into the correct format.

main.js:
```javascript
import Translator from './translator.js';

// Helper function to parse CSV and convert to the required JSON structure
async function loadTranslationsFromCSV(url) {
    const response = await fetch(url);
    const csvText = await response.text();
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const languages = headers.slice(1);
    const translations = {};

    languages.forEach(lang => translations[lang] = {});

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const key = values[0].trim();
        
        languages.forEach((lang, langIndex) => {
            const text = values[langIndex + 1].trim().replace(/"/g, '');
            const keys = key.split('.');
            let current = translations[lang];
            for (let j = 0; j < keys.length - 1; j++) {
                current[keys[j]] = current[keys[j]] || {};
                current = current[keys[j]];
            }
            current[keys[keys.length - 1]] = text;
        });
    }
    return translations;
}

// Initialize and load data
async function init() {
    const translationsData = await loadTranslationsFromCSV('./translations.csv');
    const translator = new Translator('en');
    translator.load(translationsData);
    translator.apply();

    window.setLang = (lang) => translator.setLanguage(lang);
}

document.addEventListener('DOMContentLoaded', init);
```

## 🕹️ Language Switcher Examples
Add one of these snippets to your HTML to allow users to change the language. The setLang() function you defined in your script will handle the logic.

### Buttons
```html
<button onclick="setLang('en')">English</button>
<button onclick="setLang('es')">Español</button>
```
### Dropdown Menu
```html
<select onchange="setLang(this.value)">
  <option value="en">English</option>
  <option value="es">Español</option>
</select>
```


## 📚 API Reference

### new Translator(initialLang = 'en')
Creates a new translator instance.
- initialLang (string): The default language code to use. Defaults to 'en'.

### .load(translationsData)
Loads the translation object into the instance.
- translationsData (object): The object containing all language translations.

### .setLanguage(lang)
Sets the current language and triggers a re-render of all translated elements on the page.
- lang (string): The language code to switch to (e.g., 'es').

### .get(key, vars = {})
Retrieves a specific translated string for the current language.
- key (string): The dot-notation key for the translation.
- vars (object, optional): An object of key-value pairs to replace placeholders in the string.

### .apply()
Scans the entire document for data-translate attributes and updates the content of those elements with the correct translation.

## 📄 License
This project is open source and available under the MIT License.
