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
        listItem.textContent = `${edu.degree} in ${edu.field} - ${edu.year} (${edu.grade})`;
        educationList.appendChild(listItem);
    });
}

// Funzione per popolare la sezione dell'esperienza lavorativa
function populateWorkExperience(data) {
    const workExperienceList = document.getElementById('work-experience-list');

    data.workExperience.forEach(exp => {
        const listItem = document.createElement('li');
        listItem.textContent = `${exp.position} presso ${exp.company} (${exp.startDate} - ${exp.endDate})`;

        // Aggiungi la lista di progetti e attività
        const projectList = document.createElement('ul');
        exp.projects.forEach(project => {
            const projectItem = document.createElement('li');
            projectItem.textContent = project.name;

            // Aggiungi la lista di attività e tecnologie
            const activityList = document.createElement('ul');
            project.activities.forEach(activity => {
                const activityItem = document.createElement('li');
                activityItem.textContent = activity.name;

                // Aggiungi la lista di tecnologie
                const technologyList = document.createElement('ul');
                activity.technologies.forEach(technology => {
                    const technologyItem = document.createElement('li');
                    technologyItem.textContent = technology;
                    technologyList.appendChild(technologyItem);
                });

                activityItem.appendChild(technologyList);
                activityList.appendChild(activityItem);
            });

            projectItem.appendChild(activityList);
            projectList.appendChild(projectItem);
        });

        listItem.appendChild(projectList);
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
        link.href = item.html_url;
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
    window.jsPDF = window.jspdf.jsPDF;

    const doc = new jsPDF();

    // Ottieni l'elemento HTML che contiene il tuo curriculum
    const element = document.getElementById('curriculum');

    // Converte l'elemento HTML in una stringa utilizzando outerHTML
    const html = element.outerHTML;

    // Configura le opzioni di conversione
    const options = {
        format: 'letter', // Formato della pagina (es. 'letter', 'a4', 'a3')
        margin: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        },
        html2canvas: {
            scale: 2, // Scala per migliorare la qualità delle immagini (opzionale)
            useCORS: true // Abilita CORS per evitare problemi di sicurezza con l'immagine (opzionale)
        },
        jsPDF: {
            unit: 'mm' // Unità di misura per il documento PDF (es. 'pt', 'mm', 'cm', 'in')
        }
    };

    // Crea il documento PDF utilizzando il metodo fromHTML()
    doc.fromHTML(html, options, () => {
        // Salva il PDF utilizzando il metodo save()
        doc.save('curriculum.pdf');
    });
}

// Inizializzazione al caricamento della pagina HTML
document.addEventListener('DOMContentLoaded', initialize);
