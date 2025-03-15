const { resetPassword } = require('../../controllers/authController');
const authModel = require('../../models/authModel');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../../middlewares/authMiddleware');

// Mock dependencies
jest.mock('../../models/authModel', () => ({
    verification: jest.fn(),
    test: jest.fn(),
    changement: jest.fn()
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedNewPassword')
}));

// Mock the entire authMiddleware
jest.mock('../../middlewares/authMiddleware', () => ({
    verifyToken: jest.fn((req, res, next) => {
        // Simulate a verified user
        req.user = { id: 'user-123' };
        next();
    })
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

describe('Tests unitaires de resetPassword', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Réinitialisation de mot de passe réussie', async () => {
        // Mocking successful scenarios
        authModel.verification.mockResolvedValue(0); // Nouveau mot de passe différent des précédents
        authModel.test.mockResolvedValue(1); // Lieu et date de naissance valides
        authModel.changement.mockResolvedValue(true);

        const req = {
            user: { id: 'user-123' }, // Simulating authenticated user from token verification
            body: {
                motDePasse1: 'NewSecurePassword123',
                motDePasse2: 'NewSecurePassword123',
                date_naissance: '1990-01-01',
                lieu_naissance: 'Paris'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, resetPassword);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Le mot de passe a été modifié avec succès" 
        });

        // Verify method calls
        expect(authModel.verification).toHaveBeenCalledWith('NewSecurePassword123', 'user-123');
        expect(authModel.test).toHaveBeenCalledWith('1990-01-01', 'Paris', 'user-123');
        expect(authModel.changement).toHaveBeenCalledWith('hashedNewPassword', 'user-123');
    });

    test('Échec - Mot de passe déjà utilisé', async () => {
        // Mocking scenario where password was previously used
        authModel.verification.mockResolvedValue(1);

        const req = {
            user: { id: 'user-123' },
            body: {
                motDePasse1: 'PreviousPassword123',
                motDePasse2: 'PreviousPassword123',
                date_naissance: '1990-01-01',
                lieu_naissance: 'Paris'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, resetPassword);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Ce mot de passe est déjà utilisé !!" 
        });
    });

    test('Échec - Lieu ou date de naissance invalides', async () => {
        // Mocking scenario with invalid birth details
        authModel.verification.mockResolvedValue(0);
        authModel.test.mockResolvedValue(0);

        const req = {
            user: { id: 'user-123' },
            body: {
                motDePasse1: 'NewSecurePassword123',
                motDePasse2: 'NewSecurePassword123',
                date_naissance: '1990-01-01',
                lieu_naissance: 'InvalidPlace'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, resetPassword);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Le lieu ou la date de naissance sont pas valide !!" 
        });
    });

    test('Validation - Mots de passe différents', async () => {
        const req = {
            user: { id: 'user-123' },
            body: {
                motDePasse1: 'NewSecurePassword123',
                motDePasse2: 'DifferentPassword456',
                date_naissance: '1990-01-01',
                lieu_naissance: 'Paris'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, resetPassword);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining([
                expect.objectContaining({ 
                    msg: "Veuillez entrer le même mot de passe."
                })
            ])
        }));
    });

    test('Validation - Mot de passe trop court', async () => {
        const req = {
            user: { id: 'user-123' },
            body: {
                motDePasse1: 'Short1',
                motDePasse2: 'Short1',
                date_naissance: '1990-01-01',
                lieu_naissance: 'Paris'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, resetPassword);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining([
                expect.objectContaining({ 
                    msg: "Le mot de passe doit contenir au moins 8 caractères."
                })
            ])
        }));
    });

    test('Validation - Mot de passe sans majuscule ou chiffre', async () => {
        const req = {
            user: { id: 'user-123' },
            body: {
                motDePasse1: 'passwordonly',
                motDePasse2: 'passwordonly',
                date_naissance: '1990-01-01',
                lieu_naissance: 'Paris'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await runMiddleware(req, res, resetPassword);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining([
                expect.objectContaining({ 
                    msg: "Doit contenir au moins une majuscule et un chiffre."
                })
            ])
        }));
    });

    test('Gestion d\'une erreur serveur', async () => {
        // Use mockImplementation to ensure the rejection occurs when called
        authModel.verification.mockImplementation(() => Promise.reject(new Error('Database connection failed')));
        
        const req = {
            user: { id: 'user-123' },
            body: {
                motDePasse1: 'NewSecurePassword123',
                motDePasse2: 'NewSecurePassword123',
                date_naissance: '1990-01-01',
                lieu_naissance: 'Paris'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };
    
        // Suppress console.error output during test
        jest.spyOn(console, 'error').mockImplementation(() => {});
    
        await runMiddleware(req, res, resetPassword);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Erreur serveur ❌"
        });
    });

});