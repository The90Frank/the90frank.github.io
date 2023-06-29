// Funzione per ottenere i dati dal file JSON
function getJSONData(callback) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Errore nel recupero dei dati JSON:', error));
}

// Funzione per ottenere la lista pubblica dei progetti GitHub di un utente
function getGitHubProjects(username, callback) {
    const url = `https://api.github.com/users/${username}/repos`;

    fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Errore nel recupero dei progetti GitHub:', error));
}

// Funzione per popolare la sezione dell'educazione
function populateEducation(data) {
    const educationList = document.getElementById('education-list');

    data.education.forEach(edu => {
        const listItem = document.createElement('li');
        listItem.textContent = `${edu.degree} in ${edu.field} - ${edu.year}`;
        educationList.appendChild(listItem);
    });
}

// Funzione per popolare la sezione dell'esperienza lavorativa
function populateWorkExperience(data) {
    const workExperienceList = document.getElementById('work-experience-list');

    data.workExperience.forEach(exp => {
        const listItem = document.createElement('li');
        listItem.textContent = `${exp.position} presso ${exp.company} (${exp.startDate} - ${exp.endDate})`;
        workExperienceList.appendChild(listItem);
    });
}

// Funzione per popolare la sezione delle competenze
function populateSkills(data) {
    const skillsList = document.getElementById('skills-list');

    data.skills.forEach(skill => {
        const listItem = document.createElement('li');
        listItem.textContent = skill;
        skillsList.appendChild(listItem);
    });
}

// Funzione per popolare la sezione del portafoglio
function populatePortfolio(data) {
    const portfolioList = document.getElementById('portfolio-list');
    data.forEach(item => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.name;
        listItem.appendChild(link);
        portfolioList.appendChild(listItem);
    });
}

// Funzione di inizializzazione
function initialize() {
    // Imposta l'username GitHub
    const githubUsername = 'The90Frank';

    getJSONData(data => {
        populateEducation(data);
        populateWorkExperience(data);
        populateSkills(data);
    });

    getGitHubProjects(githubUsername, data => {
        populatePortfolio(data);
    });
}

function downloadAsPDF() {
    const doc = new jsPDF();

    // Ottieni l'elemento HTML che contiene il tuo curriculum
    const element = document.getElementById('curriculum');

    // Converte l'elemento HTML in un'immagine base64 utilizzando il metodo toDataURL()
    const imageData = element.toDataURL();

    // Aggiungi l'immagine al PDF utilizzando il metodo addImage()
    doc.addImage(imageData, 'JPEG', 10, 10, 190, 0);

    // Salva il PDF utilizzando il metodo save()
    doc.save('curriculum.pdf');
}

// Funzione per attivare/disattivare la traduzione
function toggleTranslation() {
    const translateButton = document.querySelector('.floating-translate-button');
    const translateButtonLabel = translateButton.innerText;

    if (translateButtonLabel === 'Traduci') {
        translateButton.innerText = 'Annulla';
        translateContent();
    } else {
        translateButton.innerText = 'Traduci';
        restoreContent();
    }
}

// Funzione per tradurre il contenuto
function translateContent() {
    // Effettua qui la traduzione del contenuto in inglese
    // Puoi utilizzare una libreria come Google Translate o un servizio di traduzione automatica

    // Esempio: traduzione dei titoli delle sezioni
    const sectionHeadings = document.querySelectorAll('.section h2');
    sectionHeadings.forEach((heading) => {
        const italianText = heading.innerText;
        // Traduci il testo in inglese e assegna il valore tradotto al titolo
        const englishText = translateToEnglish(italianText);
        heading.innerText = englishText;
    });
}

// Funzione per ripristinare il contenuto originale
function restoreContent() {
    // Ripristina qui il contenuto originale in italiano
    // Puoi reimpostare i valori del JSON o recuperarli da un'altra fonte

    // Esempio: ripristino dei titoli delle sezioni in italiano
    const sectionHeadings = document.querySelectorAll('.section h2');
    sectionHeadings.forEach((heading) => {
        const englishText = heading.innerText;
        // Ripristina il testo in italiano e assegna il valore originale al titolo
        const italianText = translateToItalian(englishText);
        heading.innerText = italianText;
    });
}

// Funzione per tradurre il testo in inglese utilizzando ChatGPT
async function translateToEnglish(text) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
            messages: [
                { role: 'system', content: 'You: ' + text },
                { role: 'user', content: 'Translate this to English.' }
            ],
            max_tokens: 50
        })
    });

    const { choices } = await response.json();
    return choices[0].message.content.replace('Assistant:', '').trim();
}

// Funzione per tradurre il testo in italiano utilizzando ChatGPT
async function translateToItalian(text) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
            messages: [
                { role: 'system', content: 'You: ' + text },
                { role: 'user', content: 'Traduci questo in italiano.' }
            ],
            max_tokens: 50
        })
    });

    const { choices } = await response.json();
    return choices[0].message.content.replace('Assistant:', '').trim();
}

// Inizializzazione al caricamento della pagina HTML
document.addEventListener('DOMContentLoaded', initialize);