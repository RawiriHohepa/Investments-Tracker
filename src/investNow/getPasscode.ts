export {};
import fs from 'fs'
import readline from 'readline'
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const getPasscode = async () => {
  const oAuth2Client = await authorize();
  return getAndParseMessages(oAuth2Client);
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
const authorize = async () => {
  // Load client secrets from a local file.
  const content = fs.readFileSync('credentials.json', "utf-8");
  const credentials = JSON.parse(content);

  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  try {
    const token = fs.readFileSync(TOKEN_PATH).toString();

    await oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    return await getNewToken(oAuth2Client);
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
// FIXME doesn't work to set new token, must use googleapi.ts
const getNewToken = async (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question('Enter the code from that page here: ', async (code) => {
      rl.close();
      const token = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('Token stored to', TOKEN_PATH);
      resolve(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const getAndParseMessages = async (auth) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'subject:Login Passcode',
  });

  const messageSnippets = res.data.messages;
  const messages = await Promise.all(messageSnippets.map(async (messageSnippet, index) => {
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: messageSnippet.id,
    });

    return res.data.payload;
  }));
  const message: any = messages[0];

  const parts = message.parts.map(part => part.parts);
  const parts0 = parts[0];
  const part0_0 = parts0[0];
  const part0_0Message = part0_0.body.data;
  const part0_0Decoded = new Buffer(part0_0Message, 'base64').toString();
  const words = part0_0Decoded.replace('\r', "").replace('\n', "").split(' ');
  return words[0];
}

module.exports = getPasscode;