const routes = {
    '/': 'notelab.html',
    '/write': 'write-data.html',
    '/view': 'view-data.html',
    '/browse': 'browse-data.html'
};

// Update all navigation links to use the new format
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href.endsWith('.html')) {
            const newPath = '/' + href.replace('.html', '').replace('notelab', '');
            link.setAttribute('href', newPath || '/');
        }
    });
});