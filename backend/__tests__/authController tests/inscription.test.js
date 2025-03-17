const { FuncInscription } = require('../../controllers/authController');
const authModel = require('../../models/authModel');

// Mock dependencies
jest.mock('../../models/authModel', () => ({
    ajouterUtilisateur: jest.fn(),
}));

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('test-uuid-1234')
}));

// Mock bcrypt for password hashing
jest.mock('bcryptjs', () => ({
    genSalt: jest.fn().mockResolvedValue('fakeSalt'),
    hash: jest.fn().mockResolvedValue('hashedPassword123')
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

describe('Tests unitaires de FuncInscription', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Inscription avec des données valides', async () => {
        //mocker un utilisateur qui a été ajouté avec succès
        const mockUser = {
            id: 'test-uuid-1234',
            nom: 'El Ibrahimi',
            email: 'rim.elibrahimi@example.com'
        };
        authModel.ajouterUtilisateur.mockResolvedValue(mockUser);
        
        const req = {
            body: {
                nom: 'El Ibrahimi',
                email: 'rim.elibrahimi@example.com',
                motDePasse: 'Password123',
                date_naissance: '1995-08-15',
                lieu_naissance: 'Tanger'
            }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await runMiddleware(req, res, FuncInscription);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Inscription réussie ✅", 
            utilisateur: mockUser 
        });
        expect(authModel.ajouterUtilisateur).toHaveBeenCalledWith(
            'test-uuid-1234',  // UUID est mocké
            'El Ibrahimi', 
            'rim.elibrahimi@example.com', 
            'hashedPassword123',  //c notre mot de passe hashé mocké
            '1995-08-15', 
            'Tanger'
        );
    });

    test('Inscription avec un email déjà utilisé', async () => {
        //mocker une violation de contrainte unique
        const duplicateError = new Error('Duplicate email');
        duplicateError.code = '23505';
        authModel.ajouterUtilisateur.mockRejectedValue(duplicateError);
        
        const req = {
            body: {
                nom: 'Fairadi',
                email: 'Fairadi.ihssanet@example.com',
                motDePasse: 'Ihssane2024A',
                date_naissance: '2000-05-22',
                lieu_naissance: 'Ben Slimane'
            }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await runMiddleware(req, res, FuncInscription);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Cet email est déjà utilisé ❌"});
    });

    test('Inscription avec un mot de passe trop faible', async () => {
        const req = {
            body: {
                nom: 'laaroussi',
                email: 'sara.laaroussi@example.com',
                motDePasse: '123',  //tres court, pas de majuscule
                date_naissance: '1998-02-10',
                lieu_naissance: 'Tanger'
            }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await runMiddleware(req, res, FuncInscription);

        // On expecte la validation à échouer avec un statut 400
        expect(res.status).toHaveBeenCalledWith(400);
        // S'assurer que le message d'erreur est bien lié au mot de passe
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining([
                expect.objectContaining({ 
                    msg: 'Le mot de passe doit contenir au moins 8 caractères.'
                })
            ])
        });
    });

    test('Inscription avec un email invalide', async () => {
        const req = {
            body: {
                nom: 'Errami',
                email: 'errami.chaimae@invalide',  // format d'email invalide
                motDePasse: 'SecurePass123',
                date_naissance: '1997-06-30',
                lieu_naissance: 'Fes'
            }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await runMiddleware(req, res, FuncInscription);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining([
                expect.objectContaining({ msg: 'Email invalide.'})
            ])
        });
    });

    test('Inscription avec un champ manquant (nom vide)', async () => {
        const req = {
            body: {
                nom: '',  // sans nom
                email: 'elibrahimi.rim@example.com',
                motDePasse: 'StrongPass123',
                date_naissance: '1990-12-01',
                lieu_naissance: 'Tanger'
            }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await runMiddleware(req, res, FuncInscription);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining([
                expect.objectContaining({ msg: 'Le nom est requis.'})
            ])
        });
    });

    test('Erreur serveur lors de l\'inscription', async () => {
        // Mocker un erreur de serveur
        authModel.ajouterUtilisateur.mockRejectedValue(new Error('Database connection failed'));
        
        const req = {
            body: {
                nom: 'Rim',
                email: 'rim.elibrahimi@example.com',
                motDePasse: 'Password123',
                date_naissance: '1995-08-15',
                lieu_naissance: 'Tanger'
            }
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };
        
        // Mock console.error to prevent error output during test
        console.error = jest.fn();

        await runMiddleware(req, res, FuncInscription);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Erreur serveur ❌"});
    });
    test('Inscription avec un mot de passe interdit', async () => {
        const forbiddenPasswords = [
            'password',
            '123456',
            'qwerty',
            'abcdef',
            '654321'
        ];

        for (const forbiddenPassword of forbiddenPasswords) {
            const req = {
                body: {
                    nom: 'TestUser',
                    email: `test-${forbiddenPassword}@example.com`,
                    motDePasse: forbiddenPassword,
                    date_naissance: '1990-01-01',
                    lieu_naissance: 'TestCity'
                }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await runMiddleware(req, res, FuncInscription);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                errors: expect.arrayContaining([
                    expect.objectContaining({ 
                        msg: 'Veuillez choisir un mot de passe plus sécurisé.'
                    })
                ])
            });
        }
    });

    test('Inscription avec des formats de date de naissance invalides', async () => {
        const invalidDateFormats = [
            '2023/12/31',     // Incorrect separator
            '31-12-2023',     // Incorrect order
            '2023.12.31',     // Another incorrect separator
            '2023-13-32',     // Invalid month and day
            'invalid-date',   // Not a date at all
            ''                // Empty string
        ];

        for (const invalidDate of invalidDateFormats) {
            const req = {
                body: {
                    nom: 'DateTestUser',
                    email: `date-test-${invalidDate}@example.com`,
                    motDePasse: 'StrongPass123',
                    date_naissance: invalidDate,
                    lieu_naissance: 'TestCity'
                }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await runMiddleware(req, res, FuncInscription);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                errors: expect.arrayContaining([
                    expect.objectContaining({ 
                        msg: 'La date de naissance doit être au format AAAA-MM-JJ.'
                    })
                ])
            });
        }
    });
});