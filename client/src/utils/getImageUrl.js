export const ImagePath = {
    LANDING: 'landing',
    USERS: 'users',
    ECOMMERCE: 'e-commerce',
    PROFILE: 'profile',
    MOVIES: 'movies',
    MEMBERS: 'members',
    SUBSCRIPTIONS: 'subscriptions'
};

export function getImageUrl(name, path) {
    return new URL(`/src/assets/images/${path}/${name}`, import.meta.url).href;
}
