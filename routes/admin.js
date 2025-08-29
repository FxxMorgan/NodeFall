const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Admin password hash
const ADMIN_PASSWORD_HASH = '$2b$10$YNN4KDL8jhSAoRhMMi3uEexYWmF2Oc6vOUWmu/uc5rNJ3UmH91F6e';

// Admin login endpoint
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({
                success: false,
                error: 'Password is required'
            });
        }

        // Compare with hashed password
        const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        
        if (isValid) {
            // Generate session token
            const sessionToken = require('crypto').randomBytes(32).toString('hex');
            
            res.json({
                success: true,
                message: 'Authentication successful',
                token: sessionToken,
                expiresIn: 24 * 60 * 60 * 1000 // 24 hours
            });
        } else {
            // Add small delay to prevent brute force
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            res.status(401).json({
                success: false,
                error: 'Invalid password'
            });
        }

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

module.exports = router;