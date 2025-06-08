import { ObservationClient } from '../src';

async function main() {
  const client = new ObservationClient();

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

  console.log(
    '\\n--- Note: Other user endpoints like registration, login, and profile updates require user interaction or authentication and are not demonstrated here. ---'
  );
}

main().catch(console.error); 