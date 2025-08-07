import Typesense from 'typesense';

const typesense = new Typesense.Client({
  nodes: [
    {
      host: 'localhost',
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: 'xyz', // Replace with your Typesense API key
  connectionTimeoutSeconds: 2,
});

export default typesense;