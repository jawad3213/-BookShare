const { FuncChange } = require('../../controllers/authController');
const authModel = require('../../models/authModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../models/authModel', () => ({
    changemodel: jest.fn(),
}));

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(true)
    })
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mocked-reset-token')
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

describe('Tests unitaires de FuncChange', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset environment variables
        process.env.JWT_SECRET = 'test-secret';
        process.env.EMAIL_USER = 'test@example.com';
    });

    test('Demande de réinitialisation de mot de passe réussie', async () => {
        const mockUser = {
            id: 'user-123',
            email: 'valid.user@example.com'
        };
        authModel.changemodel.mockResolvedValue(mockUser);
        
        const req = {
            body: {
                email: 'valid.user@example.com'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, FuncChange);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Un email de réinitialisation a été envoyé , veuillez verifier spam✅"
        });

        // Vérifier que les méthodes ont été appelées correctement
        expect(authModel.changemodel).toHaveBeenCalledWith('valid.user@example.com');
        expect(jwt.sign).toHaveBeenCalledWith(
            { 
                id: 'user-123', 
                email: 'valid.user@example.com' 
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
    });

    test('Échec de la demande - Utilisateur non trouvé', async () => {
        authModel.changemodel.mockResolvedValue(null);
        
        const req = {
            body: {
                email: 'nonexistent.user@example.com'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, FuncChange);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "utilisateur non trouvé avec cet email❌"
        });
    });

    test('Échec de la demande - Email manquant', async () => {
        const req = {
            body: {
                email: ''
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, FuncChange);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining([
                expect.objectContaining({ 
                    msg: "L'email est requis."
                })
            ])
        }));
    });

    test('Échec de la demande - Email invalide', async () => {
        const req = {
            body: {
                email: 'invalidemail'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, FuncChange);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining([
                expect.objectContaining({ 
                    msg: "Email invalide."
                })
            ])
        }));
    });

    test('Gestion d\'une erreur serveur', async () => {
        authModel.changemodel.mockRejectedValue(new Error('Database connection failed'));
        
        const req = {
            body: {
                email: 'test.user@example.com'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        // Mock console.error to prevent error output during test
        console.error = jest.fn();

        await runMiddleware(req, res, FuncChange);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Erreur serveur ❌"
        });
    });
});