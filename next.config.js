module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/inventory',
        permanent: true
      }
    ];
  }
};
