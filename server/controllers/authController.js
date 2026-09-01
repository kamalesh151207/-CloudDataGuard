const ActivityLog = require('../models/ActivityLog');

/**
 * Enterprise Auth Controller for CloudDataGuard
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email address and password are required.'
      });
    }

    // Demo Authentication validation
    const formattedEmail = email.trim().toLowerCase();

    // Audit log entry
    await ActivityLog.create({
      eventType: 'SYSTEM_HEALTH_CHECK',
      status: 'verified',
      description: `User login authenticated for ${formattedEmail}`,
      metadata: { email: formattedEmail, ip: req.ip }
    }).catch(err => console.error('Failed to log login event:', err));

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      user: {
        id: 'usr_admin_99',
        name: 'Cloud Security Admin',
        email: formattedEmail,
        role: 'Enterprise Cloud Administrator',
        department: 'Cloud Security & Compliance'
      },
      token: 'jwt_mock_token_clouddataguard_codealpha_2026'
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: 'usr_admin_99',
      name: 'Cloud Security Admin',
      email: 'admin@clouddataguard.io',
      role: 'Enterprise Cloud Administrator',
      department: 'Cloud Security & Compliance'
    }
  });
};

module.exports = {
  loginUser,
  getMe
};
