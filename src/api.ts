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

        try {
            const result = await retryAsync(
                async () => {
                    let attempt;
                    try {
                        let response = await fetch(location, params);

                        // If response is a 400 or 401, redirect to login.
                        if ([400, 401].includes(response.status)) {
                            window.location.href = "/login";
                        }

                        attempt = await response.json();
    
                    } catch (e) {
                        attempt = {
                        }
                    }
    
                    return attempt;
                },
                { delay: 100, maxTry: 3, until: (lastResult) => {
                    return 'ok' in lastResult
                } }
              );

              return result;
        } catch (err) {
            return {
                'ok': false
            }
        }          

    }

}