# Security Guide - CyberPortfolio

This document describes the security implementations and best practices for the CyberPortfolio project.

## Overview

The CyberPortfolio has been secured according to BTS SIO1 standards and industry best practices. This includes authentication, form protection, security headers, and more.

## Authentication System

### Admin Area Protection

The admin area (`admin.php`) is now protected with server-side PHP authentication:

- **Login Page**: Access via `/login.php`
- **Admin Panel**: Only accessible after authentication at `/admin.php`
- **Logout**: Use `/logout.php` to end the session

### Default Credentials

**For development only:**
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT FOR PRODUCTION:**
1. Copy `includes/credentials.example.php` to `includes/credentials.php`
2. Generate a new password hash:
   ```bash
   php -r "echo password_hash('YourNewPassword', PASSWORD_DEFAULT);"
   ```
3. Replace the hash in `includes/credentials.php`
4. Never commit `credentials.php` to version control

### Session Management

- Sessions timeout after 1 hour of inactivity
- Session IDs are regenerated on login to prevent session fixation
- Sessions are properly destroyed on logout

## Form Security

### Contact Form Protection

The contact form at `/contact/` includes multiple layers of security:

#### 1. CSRF Protection
- Each form includes a unique CSRF token
- Tokens are validated on submission
- Tokens are regenerated after each use

#### 2. Honeypot Field
- Hidden `website` field catches bots
- Must remain empty for valid submissions
- Positioned off-screen with CSS

#### 3. Rate Limiting
- Maximum 1 submission per 60 seconds per session
- Prevents spam and abuse
- Configurable in `includes/security.php`

#### 4. Input Validation
- Server-side validation for all fields
- Minimum/maximum length checks
- Email format validation
- XSS prevention with `htmlspecialchars()`

#### 5. Header Injection Prevention
- Email addresses checked for newline characters
- Headers properly formatted
- Using safe `From` address

## Security Headers

The `.htaccess` file implements several security headers:

### Content Security Policy (CSP)
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; 
style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; 
font-src 'self' https://cdnjs.cloudflare.com data:; img-src 'self' data:;
```

**Note**: `unsafe-inline` is currently used for inline scripts/styles. Consider moving to external files in production.

### Other Headers
- **X-Frame-Options**: `DENY` - Prevents clickjacking
- **X-Content-Type-Options**: `nosniff` - Prevents MIME sniffing
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Controls referrer information
- **Strict-Transport-Security**: Forces HTTPS (uncomment in production)

## File Protection

### Protected Files
The `.htaccess` prevents direct access to:
- `credentials.php`
- `.htaccess`
- `.gitignore`
- `.env` files
- `includes/` directory

### Git Ignore
The `.gitignore` file ensures sensitive files are never committed:
- `includes/credentials.php`
- `.env` files
- Log files

## SEO and Technical

### Robots.txt
- Disallows indexing of admin pages
- Disallows indexing of test/performance pages
- Includes sitemap location

### Sitemap.xml
- Lists all public pages
- Includes priority and change frequency
- Helps search engines index the site

### 404 Error Page
- Custom branded error page
- Links back to main navigation
- Maintains site design consistency

## Security Functions

The `includes/security.php` file provides reusable security functions:

### CSRF Functions
- `generateCSRFToken()` - Generate new token
- `verifyCSRFToken($token)` - Verify token validity
- `regenerateCSRFToken()` - Create new token after use

### Rate Limiting
- `checkRateLimit($minSeconds)` - Prevent rapid submissions
- `trackAttempts($context, $maxAttempts)` - Track failed attempts

### Input Validation
- `sanitizeString($input)` - Clean string input
- `validateEmail($email)` - Validate and sanitize email
- `validateLength($input, $min, $max)` - Check string length
- `checkHoneypot($fieldName)` - Verify honeypot is empty

### Headers
- `setSecurityHeaders()` - Apply security headers to responses

## Testing Security

### Test Authentication
1. Visit `/admin.php` - should redirect to `/login.php`
2. Login with credentials
3. Access should be granted to admin panel
4. Visit `/logout.php` - should return to home

### Test Form Security
1. Submit contact form without CSRF token - should fail
2. Fill honeypot field - should fail
3. Submit valid form - should succeed
4. Submit again within 60s - should fail (rate limit)

### Test Headers
Use browser DevTools or curl to verify headers:
```bash
curl -I https://your-domain.com/
```

## Production Checklist

Before deploying to production:

- [ ] Change admin password and update hash
- [ ] Enable HTTPS redirect in `.htaccess`
- [ ] Verify `credentials.php` is not in version control
- [ ] Test all authentication flows
- [ ] Test contact form submission
- [ ] Verify security headers with browser tools
- [ ] Review CSP and adjust if needed
- [ ] Set up proper error logging
- [ ] Configure email sending (if using mail())
- [ ] Update sitemap.xml with production URLs
- [ ] Test 404 page behavior

## Maintenance

### Regular Tasks
- Review and rotate admin credentials periodically
- Monitor error logs for security issues
- Update PHP and server software
- Review and update CSP as needed

### Monitoring
- Check failed login attempts in session logs
- Monitor rate limit triggers
- Review contact form submissions

## Support

For security concerns or questions:
- Review this documentation
- Check PHP error logs
- Test in development environment first
- Consult BTS SIO security guidelines

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PHP Security Best Practices](https://www.php.net/manual/en/security.php)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
