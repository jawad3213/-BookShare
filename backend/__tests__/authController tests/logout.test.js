const { FuncLogout } = require('../../controllers/authController');

describe('Tests unitaires de FuncLogout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Déconnexion réussie', async () => {
        const req = {};
        const res = { 
            clearCookie: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await FuncLogout(req, res);

        // Vérifier que clearCookie a été appelé avec les bons paramètres
        expect(res.clearCookie).toHaveBeenCalledWith('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        // Vérifier que la redirection vers la page d'accueil a été effectuée
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('Gestion d\'une erreur lors de la déconnexion', async () => {
        const req = {};
        const res = { 
            clearCookie: jest.fn().mockImplementation(() => {
                throw new Error('Cookie clearance failed');
            }),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock console.error to prevent error output during test
        console.error = jest.fn();

        await FuncLogout(req, res);

        // Vérifier que le statut d'erreur serveur a été envoyé
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Erreur serveur ❌"
        });

        // Vérifier que l'erreur a été logged
        expect(console.error).toHaveBeenCalled();
    });
});