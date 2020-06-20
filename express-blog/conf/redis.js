const redis = require('redis');
const  { REDIS_CONFIG } = require('../conf/db');
const redisClient = redis.createClient(REDIS_CONFIG);

redisClient.on('err', () => {
    console.log(err);
    
})

module.exports = redisClient;