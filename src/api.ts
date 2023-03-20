import {retryAsync} from 'ts-retry';

export class RiskyApi {

    // Primary wrapper for making authenticated API calls.
    // Will check for a sessionToken, and, if one doesn't exist,
    // it will redirect to the login page.
    static async call(location: string, params: Record<string, any>) {
        const sessionToken = localStorage.getItem("sessionToken");

        if (!sessionToken) {
            window.location.href = "/login";
        }

        params['headers'] = {
            'Authorization': sessionToken
        }

        const result = await retryAsync(
            async () => {
                let attempt;
                let response = await fetch(location, params);
                attempt = await response.json();

                return attempt;
            },
            { delay: 100, maxTry: 3, until: (lastResult) => {
                return 'ok' in lastResult
            } }
          );

          return result;

    }

}