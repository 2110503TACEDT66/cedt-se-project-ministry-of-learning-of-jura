import { cleanEnv, num, str } from "envalid";
import dotenv from "dotenv"
import path from "path"
dotenv.config({
    path:path.join(__dirname,"./config.env")
})
const env = cleanEnv(process.env,{
    MONGO_URI: str(),
    DEPLOY_MODE: str(),
    JWT_EXPIRING_DAYS: num(),
    PORT: num(),
    JWT_SECRET: str(),
    SUPERUSER_PASSWORD: str(),
    MAX_IMAGE_MB_SIZE: num(),
    CHURN_DURATION: num() //days
})

export default env;