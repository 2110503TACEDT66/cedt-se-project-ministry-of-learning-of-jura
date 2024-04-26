/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ["localhost",`${process.env.BACKEND_URL}`],
    },
};

export default nextConfig;
