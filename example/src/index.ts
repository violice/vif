import { VIF } from '../../dist';

const API_URL = 'https://some-api.com';
const TOKEN = 'SOME_TOKEN';

const bazarApiClient = new VIF({
  baseUrl: API_URL,
  beforeRequest: async options => {
    options.headers = {
      ...options.headers,
      'accept-language': 'en',
      'x-access-token': TOKEN,
    };
  },
});

bazarApiClient
  .get('users')
  .then(res => console.dir(res))
  .catch(err => console.dir(err));
