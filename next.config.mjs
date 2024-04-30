/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'dummyimage.com', //"https:///"/
            port: '',
            pathname: '/720x600/**',
          },
        ],
      },
};

export default nextConfig;

// module.exports = {
    
//   }