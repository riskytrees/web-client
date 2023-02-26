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
            let response = await fetch(location, params);
            return response.json();
        } catch (e) {
            console.log(e);
            return {
                'ok': false
            }
        }

    }

}