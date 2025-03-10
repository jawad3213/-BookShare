const request = require('supertest');
const app = require('../serveur'); // Importer l'application Express

describe('Tests du serveur', () => {
    
    // Test de la route /
    test('GET / doit retourner "Hello, World!"', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello, World!');
    });

    // Vérifier si les routes principales existent
    const routes = [
        '/authentification',
        '/utilisateurs',
        '/livres',
        '/emprunts',
        '/echanges',
        '/reset-password',
        '/hachage'
    ];

    routes.forEach(route => {
        test(`GET ${route} doit répondre avec un statut 200 comme quoi la route existe`, async () => {
            const response = await request(app).get(route); //on utilise await pour attendre la réponse
            expect(response.status).toBeGreaterThanOrEqual(200);
        });
    });

    // Test d'une route inexistante
    test('GET /route-inexistante doit retourner 404', async () => {
        const response = await request(app).get('/route-inexistante');
        expect(response.status).toBe(404);
    });

});

