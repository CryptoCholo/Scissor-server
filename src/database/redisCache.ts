import { createClient, RedisFunctions, RedisModules, RedisScripts } from "redis";
const redis_url : string = process.env['REDIS_URL'] || 'redis://redis:6379'
let redisClient : any;

(async () => {
  redisClient = createClient({url: redis_url});
  await redisClient.connect()

  redisClient.on("error", (error: any) => console.error(`Cache ConnectionError : ${error}`));

  redisClient.on( 'ready', () => {
    
    console.log('Cache successfully connected.')
  });
})();

export default redisClient ;