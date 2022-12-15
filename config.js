require('dotenv').config()

const env = process.env.NODE_ENV || 'production'

/**
 * insert your API Key & Secret for each environment 
 * keep this file local and never push it to a public repo for security purposes.
 */
const config = {
    development :{
        APIKey : process.env.TOKEN,
        APISecret : process.env.TOKEN2
    },
    production:{    
        APIKey : process.env.TOKEN,
        APISecret : process.env.TOKEN2
    }
};

module.exports = config[env]