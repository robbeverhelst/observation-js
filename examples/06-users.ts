import { ObservationClient, ApiError } from '../src';

// Load credentials from environment for OAuth authentication
const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const username = process.env.OAUTH_USERNAME;
const password = process.env.OAUTH_PASSWORD;

async function main() {
  const client = new ObservationClient({
    platform: 'nl',
    test: false
  });

  console.log('--- Fetching Terms of Service and Privacy Policy ---');
  try {
    const terms = await client.users.getTerms();
    console.log('Successfully fetched terms.');
    console.log('Terms of Service URL:', terms['tos'].permalink);
    console.log('Privacy Policy URL:', terms['privacy'].permalink);
    console.log('FAQ URL:', terms['faq-obsidentify'].permalink);
  } catch (error) {
    console.error('Error fetching terms:', error);
  }

  // If we have OAuth credentials, authenticate and demonstrate all user get methods
  if (clientId && clientSecret && username && password) {
    console.log('\n🔐 Authenticating with OAuth...');
    
    try {
      await client.getAccessTokenWithPassword({
        clientId,
        clientSecret,
        email: username,
        password,
      });
      console.log('✅ Authentication successful!\n');

      // 1. Get User Info
      console.log('--- 1. Fetching User Profile (getInfo) ---');
      try {
        const profile = await client.users.getInfo();
        console.log('Successfully fetched user profile:');
        console.log(`- ID: ${profile.id}`);
        console.log(`- Name: ${profile.name}`);
        console.log(`- Email: ${profile.email}`);
        console.log(`- Email confirmed: ${profile.consider_email_confirmed ? 'Yes' : 'No'}`);
        console.log(`- Mail allowed: ${profile.is_mail_allowed ? 'Yes' : 'No'}`);
        console.log(`- Country: ${profile.country || 'Not set'}`);
        console.log(`- Profile URL: ${profile.url}`);
        console.log(`- Avatar: ${profile.avatar || 'No avatar'}`);
        console.log(JSON.stringify(profile, null, 2));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }

      // 2. Get User Stats
      console.log('\n--- 2. Fetching User Statistics (getStats) ---');
      try {
        const stats = await client.users.getStats({ aggregation: 'year' });
        console.log('Successfully fetched user statistics:');
        const [totalObservations, totalSpecies] = stats.total;
        console.log(`- Total observations: ${totalObservations}`);
        console.log(`- Total species: ${totalSpecies}`);
        console.log(JSON.stringify(stats, null, 2));
      } catch (error) {
        if (error instanceof ApiError && error.response?.status === 404) {
          console.log('User statistics not available');
        } else {
          console.error('Failed to fetch user statistics:', error);
        }
      }

      // 3. Get User Avatar
      console.log('\n--- 3. Fetching User Avatar (getAvatar) ---');
      try {
        const avatar = await client.users.getAvatar();
        console.log('Successfully fetched user avatar:');
        console.log(JSON.stringify(avatar, null, 2));
      } catch (error) {
        if (error instanceof ApiError && error.response?.status === 404) {
          console.log('No avatar set for this user');
        } else {
          console.error('Failed to fetch user avatar:', error);
        }
      }

      // 4. Get Magic Login Link (passwordless login)
      console.log('\n--- 4. Generating Magic Login Link (getMagicLoginLink) ---');
      try {
        const magicLink = await client.users.getMagicLoginLink();
        console.log('Successfully generated magic login link:');
        console.log(JSON.stringify(magicLink, null, 2));
      } catch (error) {
        if (error instanceof ApiError && error.response?.status === 404) {
          console.log('Magic login link not available');
        } else {
          console.error('Failed to generate magic login link:', error);
        }
      }


    } catch (error) {
      console.error('Authentication failed:', error);
    }
  } else {
    console.log(
      '\n--- Note: Other user endpoints like registration, login, and profile updates require user interaction or authentication and are not demonstrated here. ---',
    );
  }
}

main().catch(console.error);