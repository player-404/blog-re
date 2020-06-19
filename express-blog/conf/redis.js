const redis = require('redis');
const  { REDIS_CONFIG } = require('../conf/db');
console.log(REDIS_CONFIG.host, REDIS_CONFIG.port);

const redisClient = redis.createClient({
    host: REDIS_CONFIG.host, 
    port: REDIS_CONFIG.port
});

redisClient.on('err', () => {
    console.log(err);
    
})

module.exports = redisClient;