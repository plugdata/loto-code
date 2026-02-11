export const ROLE_PERMISSIONS = {
    admin: [
        'numbers.read', 'numbers.create', 'numbers.delete',
        'users.read', 'users.create', 'users.delete',
        'settings.read', 'settings.write'
    ],
    agent: ['numbers.read', 'numbers.create'],
    member: ['numbers.read', 'numbers.create'],
    customer: ['numbers.read'],
};
