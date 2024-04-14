/** @type {import('next').NextConfig} */
// import dotenv from "dotenv"
// dotenv.config({path:"./.env.local"})

const nextConfig = {
    images: {
        domains: ["localhost",`${process.env.NEXT_PUBLIC_BACKEND_URL}`],
    },
    async rewrites(){
        return {
            beforeFiles:[{
                source:"/api/:path*",
                destination:process.env.NEXT_PUBLIC_BACKEND_URL+"/api/v1/:path*"
            }]
        }
    }
};

export default nextConfig;
