const authModel = require('../models/authModel');
const pool = require("../db");
const bcrypt = require('bcryptjs');

// Mock the dependencies
jest.mock('../db');
jest.mock('bcryptjs');

describe('Authentication Model Tests', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ajouterUtilisateur', () => {
    test('should add a new user and return the created user', async () => {
      // Mock data
      const id = 'user123';
      const nom = 'John Doe';
      const email = 'john@example.com';
      const motDePasse = 'hashedPassword123';
      const date_naissance = '1990-01-01';
      const lieu_naissance = 'Paris';
      
      const mockUser = { 
        id, 
        nom, 
        email, 
        mot_de_passe: motDePasse, 
        date_naissance, 
        lieu_naissance 
      };
      
      // Setup mock response
      pool.query.mockResolvedValue({
        rows: [mockUser]
      });
      
      // Call the function
      const result = await authModel.ajouterUtilisateur(
        id, nom, email, motDePasse, date_naissance, lieu_naissance
      );
      
      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO public.utilisateurs (id,nom,email,mot_de_passe,date_naissance,lieu_naissance) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [id, nom, email, motDePasse, date_naissance, lieu_naissance]
      );
      expect(result).toEqual(mockUser);
    });
    
    test('should throw an error when database insertion fails', async () => {
      // Setup mock to throw error
      const dbError = new Error('Database connection error');
      pool.query.mockRejectedValue(dbError);
      
      // Call and expect error
      await expect(authModel.ajouterUtilisateur(
        'id', 'nom', 'email', 'pass', '2000-01-01', 'Paris'
      )).rejects.toThrow(dbError);
    });
  });

  describe('loginmodel', () => {
    test('should return user data when credentials are valid', async () => {
      // Mock data
      const email = 'john@example.com';
      const motDePasse = 'password123';
      const hashedPassword = 'hashedPass123';
      const mockUser = { 
        id: 'user123', 
        email, 
        mot_de_passe: hashedPassword 
      };
      
      // Setup mocks
      pool.query.mockResolvedValue({
        rows: [mockUser]
      });
      bcrypt.compare.mockResolvedValue(true);
      
      // Call the function
      const result = await authModel.loginmodel(email, motDePasse);
      
      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.utilisateurs WHERE email = $1",
        [email]
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(motDePasse, hashedPassword);
      expect(result).toEqual(mockUser);
    });
    
    test('should return null when email is not found', async () => {
      // Setup mock for no results
      pool.query.mockResolvedValue({ rows: [] });
      
      // Call the function
      const result = await authModel.loginmodel('nonexistent@example.com', 'password');
      
      // Assertions
      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
    
    test('should return null when password is invalid', async () => {
      // Mock data
      const email = 'john@example.com';
      const motDePasse = 'wrongPassword';
      const mockUser = { 
        email, 
        mot_de_passe: 'hashedPass' 
      };
      
      // Setup mocks
      pool.query.mockResolvedValue({
        rows: [mockUser]
      });
      bcrypt.compare.mockResolvedValue(false); // Password doesn't match
      
      // Call the function
      const result = await authModel.loginmodel(email, motDePasse);
      
      // Assertions
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(result).toBeUndefined(); // Function doesn't explicitly return null in this case
    });
  });

  describe('changemodel', () => {
    test('should return user data when email exists', async () => {
      // Mock data
      const email = 'john@example.com';
      const mockUser = { id: 'user123', email };
      
      // Setup mock
      pool.query.mockResolvedValue({
        rows: [mockUser]
      });
      
      // Call the function
      const result = await authModel.changemodel(email);
      
      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM public.utilisateurs WHERE email = $1",
        [email]
      );
      expect(result).toEqual(mockUser);
    });
    
    test('should return undefined when email does not exist', async () => {
      // Setup mock for no results
      pool.query.mockResolvedValue({ rows: [] });
      
      // Call the function
      const result = await authModel.changemodel('nonexistent@example.com');
      
      // Assertions
      expect(result).toBeUndefined();
    });
  });

  describe('changement', () => {
    test('should update password and return updated user', async () => {
      // Mock data
      const id = 'user123';
      const motDePasseSecurise = 'newHashedPassword';
      const mockUser = { 
        id, 
        mot_de_passe: motDePasseSecurise 
      };
      
      // Setup mock
      pool.query.mockResolvedValue({
        rows: [mockUser]
      });
      
      // Call the function
      const result = await authModel.changement(motDePasseSecurise, id);
      
      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE public.utilisateurs SET mot_de_passe = $1 WHERE id = $2 RETURNING *",
        [motDePasseSecurise, id]
      );
      expect(result).toEqual(mockUser);
    });
    
    test('should throw error when update fails', async () => {
      // Setup mock to throw error
      const dbError = new Error('Update failed');
      pool.query.mockRejectedValue(dbError);
      
      // Call and expect error
      await expect(authModel.changement('newPass', 'userId'))
        .rejects.toThrow(dbError);
    });
  });

  describe('verification', () => {
    test('should return 0 when user has no password history', async () => {
      // Setup mock for no results
      pool.query.mockResolvedValue({ rows: [] });
      
      // Call the function
      const result = await authModel.verification('password123', 'userId');
      
      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT ancien_mot_de_passe FROM histo_mot_de_passe WHERE utilisateur_id = $1;",
        ['userId']
      );
      expect(result).toBe(0);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
    
    test('should return 1 when password matches history', async () => {
      // Mock data
      const motDePasse = 'oldPassword';
      const id = 'user123';
      const passwordHistory = [
        { ancien_mot_de_passe: 'hash1' },
        { ancien_mot_de_passe: 'hash2' }
      ];
      
      // Setup mocks
      pool.query.mockResolvedValue({ rows: passwordHistory });
      // First password doesn't match, second does
      bcrypt.compare
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);
      
      // Call the function
      const result = await authModel.verification(motDePasse, id);
      
      // Assertions
      expect(bcrypt.compare).toHaveBeenCalledTimes(2);
      expect(result).toBe(1);
    });
    
    test('should return 0 when password does not match any history', async () => {
      // Mock data
      const passwordHistory = [
        { ancien_mot_de_passe: 'hash1' },
        { ancien_mot_de_passe: 'hash2' }
      ];
      
      // Setup mocks
      pool.query.mockResolvedValue({ rows: passwordHistory });
      // No passwords match
      bcrypt.compare.mockResolvedValue(false);
      
      // Call the function
      const result = await authModel.verification('newPass', 'userId');
      
      // Assertions
      expect(bcrypt.compare).toHaveBeenCalledTimes(2);
      expect(result).toBe(0);
    });
  });

  describe('test', () => {
    test('should return 1 when date and location match', async () => {
      // Mock data
      const id = 'user123';
      const date_naissance = '1990-01-01';
      const lieu_naissance = 'paris';
      
      // Create a Date object that will match our expected format
      const mockDate = new Date('1990-01-01T00:00:00.000Z');
      
      const mockUser = { 
        date_naissance: mockDate,
        lieu_naissance: 'Paris'
      };
      
      // Setup mock
      pool.query.mockResolvedValue({
        rows: [mockUser]
      });
      
      // Call the function
      const result = await authModel.test(date_naissance, lieu_naissance, id);
      
      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT date_naissance, lieu_naissance FROM public.utilisateurs WHERE id = $1",
        [id]
      );
      expect(result).toBe(1);
    });
    
    test('should return 0 when user does not exist', async () => {
      // Setup mock for no results
      pool.query.mockResolvedValue({ rows: [] });
      
      // Call the function
      const result = await authModel.test('1990-01-01', 'Paris', 'nonexistentId');
      
      // Assertions
      expect(result).toBe(0);
    });
    
    test('should return 0 when date does not match', async () => {
      // Mock data
      const mockDate = new Date('1990-01-01T00:00:00.000Z');
      const mockUser = { 
        date_naissance: mockDate,
        lieu_naissance: 'Paris'
      };
      
      // Setup mock
      pool.query.mockResolvedValue({
        rows: [mockUser]
      });
      
      // Call with wrong date
      const result = await authModel.test('1991-01-01', 'Paris', 'userId');
      
      // Assertions
      expect(result).toBe(0);
    });
    
    test('should return 0 when location does not match', async () => {
      // Mock data
      const mockDate = new Date('1990-01-01T00:00:00.000Z');
      const mockUser = { 
        date_naissance: mockDate,
        lieu_naissance: 'Paris'
      };
      
      // Setup mock
      pool.query.mockResolvedValue({
        rows: [mockUser]
      });
      
      // Call with wrong location
      const result = await authModel.test('1990-01-01', 'Lyon', 'userId');
      
      // Assertions
      expect(result).toBe(0);
    });
    
    test('should handle case-insensitive location matching', async () => {
      // Mock data
      const mockDate = new Date('1990-01-01T00:00:00.000Z');
      const mockUser = { 
        date_naissance: mockDate,
        lieu_naissance: 'Paris'
      };
      
      // Setup mock
      pool.query.mockResolvedValue({
        rows: [mockUser]
      });
      
      // Call with different case
      const result = await authModel.test('1990-01-01', 'PARIS', 'userId');
      
      // Assertions
      expect(result).toBe(1);
    });
    
    test('should handle whitespace in location matching', async () => {
      // Mock data
      const mockDate = new Date('1990-01-01T00:00:00.000Z');
      const mockUser = { 
        date_naissance: mockDate,
        lieu_naissance: 'Paris '
      };
      
      // Setup mock
      pool.query.mockResolvedValue({
        rows: [mockUser]
      });
      
      // Call with whitespace
      const result = await authModel.test('1990-01-01', ' Paris', 'userId');
      
      // Assertions
      expect(result).toBe(1);
    });
  });
});