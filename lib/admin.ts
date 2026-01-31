// Admin utility functions

const ADMIN_EMAILS = [
    'subhamkundu.bankura12@gmail.com',
    'studio@makers3d.in',
    'support@makers3d.in'
];

/**
 * Check if an email belongs to an admin user
 */
export function isAdmin(email: string | null | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

/**
 * Get list of admin emails
 */
export function getAdminEmails(): string[] {
    return [...ADMIN_EMAILS];
}
