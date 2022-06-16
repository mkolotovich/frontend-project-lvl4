const host = '';
const prefix = 'api/v1';

export default {
  channelsPath: () => [host, prefix, 'channels'].join('/'),
  channelPath: (id) => [host, prefix, 'channels', id].join('/'),
  channelMessagesPath: (id) => [host, prefix, 'channels', id, 'messages'].join('/'),
  rootPath: () => '/',
  logInPath: () => '/login',
  signUpPath: () => '/signup',
  notFoundPath: () => '*',
  loginDataPath: () => [host, prefix, 'login'].join('/'),
  dataPath: () => [host, prefix, 'data'].join('/'),
  signUpDataPath: () => [host, prefix, 'signup'].join('/'),
};
