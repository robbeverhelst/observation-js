import { readdirSync } from 'fs';
import { join } from 'path';
import { $ } from 'bun';

async function main() {
  console.log('--- Running all example scripts ---');

  const examplesDir = __dirname;
  const files = readdirSync(examplesDir);
  const accessToken = process.env.WAARNEMING_NL_ACCESS_TOKEN || null;

  if (accessToken) {
    console.log('--- Access token found. Running authenticated examples. ---');
  } else {
    console.log(
      '--- No access token found. Skipping some authenticated examples. ---',
    );
    console.log('--- Set WAARNEMING_NL_ACCESS_TOKEN to run all examples. ---');
  }

  const scripts = files
    .filter(
      (file) =>
        file.endsWith('.ts') &&
        file !== 'test-all.ts' &&
        file !== '09-groups.ts' &&
        file !== '04-locations.ts',
    )
    .sort();

  for (const script of scripts) {
    const scriptPath = join(examplesDir, script);
    console.log(`\n--- Running: ${script} ---`);
    try {
      // We use Bun's shell to execute the script
      // We pass the access token as a command line argument
      if (accessToken) {
        await $`bun run ${scriptPath} ${accessToken}`;
      } else {
        await $`bun run ${scriptPath}`;
      }
      console.log(`\n--- Finished: ${script} ---`);
    } catch (error) {
      console.error(`--- Error running ${script} ---`);
      if (error instanceof Error) {
        // Bun's error object has stdout and stderr properties
        // @ts-expect-error - Bun's error object has stdout and stderr
        console.error('STDOUT:', error.stdout.toString());
        // @ts-expect-error - Bun's error object has stdout and stderr
        console.error('STDERR:', error.stderr.toString());
      } else {
        console.error(error);
      }
      console.error(`--- Halting execution due to error in ${script} ---`);
      process.exit(1); // Exit with an error code
    }
  }

  console.log('\n--- All example scripts ran successfully! ---');
}

main();
