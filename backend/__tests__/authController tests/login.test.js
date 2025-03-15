const { FuncLogin } = require('../../controllers/authController');
const authModel = require('../../models/authModel');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../models/authModel', () => ({
    loginmodel: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mocked-jwt-token')
}));

// Helper function to run middleware
const runMiddleware = async (req, res, middleware) => {
    for (let fn of middleware) {
        if (typeof fn !== 'function') continue;
        const next = jest.fn();
        await fn(req, res, next);
        if (next.mock.calls.length > 0) {
            continue;
        }
    }
};

describe('Tests unitaires de FuncLogin', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset process.env mock if needed
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_EXPIRES_IN = '1h';
    });

    test('Connexion réussie avec des identifiants valides', async () => {
        const mockUser = {
            id: 'user-123',
            email: 'valid.user@example.com',
            role: 'user'
        };
        authModel.loginmodel.mockResolvedValue(mockUser);
        
        const req = {
            body: {
                email: 'valid.user@example.com',
                motDePasse: 'ValidPassword123'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn(),
            cookie: jest.fn()
        };
    
        await runMiddleware(req, res, FuncLogin);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Connexion réussie ✅",
            token: "mocked-jwt-token",
            utilisateur: {
                id: 'user-123',
                email: 'valid.user@example.com',
                role: 'user'
            }
        });
    });
    test('Échec de connexion avec email invalide', async () => {
        authModel.loginmodel.mockResolvedValue(null);
        
        const req = {
            body: {
                email: 'nonexistent.user@example.com',
                motDePasse: 'SomePassword123'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, FuncLogin);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Email ou mot de passe incorrect ❌" 
        });
    });

    test('Échec de connexion avec email manquant', async () => {
        const req = {
            body: {
                email: '',
                motDePasse: 'SomePassword123'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, FuncLogin);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining([
                expect.objectContaining({ 
                    msg: "L'email est requis."
                })
            ])
        }));
    });

    test('Échec de connexion avec mot de passe manquant', async () => {
        const req = {
            body: {
                email: 'test.user@example.com',
                motDePasse: ''
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, FuncLogin);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining([
                expect.objectContaining({ 
                    msg: "Le mot de passe est requis."
                })
            ])
        }));
    });

    test('Échec de connexion avec email au format invalide', async () => {
        const req = {
            body: {
                email: 'invalidemail',
                motDePasse: 'SomePassword123'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, FuncLogin);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining([
                expect.objectContaining({ 
                    msg: "Email invalide."
                })
            ])
        }));
    });

    test('Gestion d\'une erreur serveur lors de la connexion', async () => {
        authModel.loginmodel.mockRejectedValue(new Error('Database connection failed'));
        
        const req = {
            body: {
                email: 'test.user@example.com',
                motDePasse: 'ValidPassword123'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        // Mock console.error to prevent error output during test
        console.error = jest.fn();

        await runMiddleware(req, res, FuncLogin);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Erreur serveur ❌"
        });
    });
});