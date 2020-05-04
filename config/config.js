module.exports = {
    build: {
        npmRegistry: {
            name: process.env.REGISTRY_NAME,
            auth: process.env.REGISTRY_AUTH,
            email: process.env.REGISTRY_EMAIL
        }
    },
    port: process.env.NODE_PORT || 3000,
    dbenabled: process.env.DB_ENABLED || 'false'    
};