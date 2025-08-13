import dotenv from 'dotenv';

dotenv.config();

export default class Constants {
    static PORT = process.env.PORT;
    static DB_URI = process.env.DB_URI;
    static SECRET_KEY = process.env.SECRET_KEY;
    
    static CLOUD_NAME = process.env.CLOUD_NAME;
    static API_KEY = process.env.API_KEY;
    static API_SECRET = process.env.API_SECRET;

    static STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    static STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

    static STRIPE_WEBHOOK_SECRET_KEY = process.env.STRIPE_WEBHOOK_SECRET_KEY;

    static GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    static GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; 
}