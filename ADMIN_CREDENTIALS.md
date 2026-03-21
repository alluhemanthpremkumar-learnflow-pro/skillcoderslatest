# Admin Credentials Documentation

## Admin Login Information

> **⚠️ SECURITY WARNING**: Actual credentials should NEVER be stored in version control. Store them in environment variables or a secure secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault).

### Email
```
[ADMIN_EMAIL - Set via environment variable ADMIN_EMAIL]
```

### Password
```
[ADMIN_PASSWORD - Set via environment variable ADMIN_PASSWORD]
```

---

## Important Security Notes

1. **DO NOT SHARE** these credentials with unauthorized users
2. **Change Password** after initial setup for security
3. **Enable 2FA** (Two-Factor Authentication) if available
4. **Keep Backup** of credentials in a secure location
5. **Audit Logs** - Monitor admin login activities regularly
6. **Session Timeout** - Admin sessions should have appropriate timeout settings

---

## Admin Access Points

### Admin Dashboard
- **URL**: `/admin` or `/admin-dashboard`
- **Access Level**: Admin only
- **Features**: User management, course management, payments, analytics

### Admin Login Page
- **URL**: `/admin-login`
- **Authentication**: Email & Password

---

## Administrative Tasks

- Manage user accounts and roles
- Control course content and pricing
- Monitor student enrollments
- Process payments and refunds
- Review course ratings and feedback
- Manage instructor accounts
- System configuration and settings

---

## Account Recovery

If you lose access to the admin account:
1. Contact system administrator
2. Verify identity through registered email
3. Follow account recovery process
4. Reset password through secure link

---

## Last Updated
March 16, 2026

## Next Steps
- [ ] Change default password after first login
- [ ] Enable two-factor authentication
- [ ] Set up backup admin account
- [ ] Configure session timeout settings
- [ ] Review and update admin permissions
