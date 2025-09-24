export function skipFlakyInCI(test: any, envFlag: string, reason: string) {
  const inCI = !!process.env.CI;
  const enabled = !!process.env[envFlag as keyof NodeJS.ProcessEnv];
  if (inCI && !enabled) {
    test.skip(true, `${reason} (enable by setting ${envFlag}=1 in CI env)`);
  }
}

export function configureRetriesForCI(test: any, retries = 1) {
  if (process.env.CI) {
    test.describe.configure({ retries });
  }
}

export function allowOnlyBrowsersInCI(test: any, currentBrowser: string, allowed: string[]) {
  if (process.env.CI && !allowed.includes(currentBrowser)) {
    test.skip(true, `Temporarily allow only [${allowed.join(', ')}] in CI`);
  }
}