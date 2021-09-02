window.addEventListener("DOMContentLoaded", (event) => {
    /*
      Ensure that the DOM is loaded, then add the event listener.
      here we are listening to 'before-try' event which fires when the user clicks
      on TRY, it then modifies the POST requests by adding a custom header
    */
    const rapidocEl = document.getElementById("the-doc");
    let sendTime;
    let tryCount = 0;

    rapidocEl.addEventListener("before-try", (e) => {
        const csrfTokenCookieName = "XSRF-TOKEN";
        const csrfTokenHeaderName = "X-XSRF-TOKEN";

        const getCookie = (input) => {
            let cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                let name = cookies[i].split('=')[0];
                let value = cookies[i].split('=')[1];
                if (name === input) {
                    return value;
                } else if (value === input) {
                    return name;
                }
            }
            return "";
        }

        if (e.detail.request.method === "POST"
            || e.detail.request.method === "PUT"
            || e.detail.request.method === "PATCH"
            || e.detail.request.method === "DELETE") {
            e.detail.request.headers.append(csrfTokenHeaderName, getCookie(csrfTokenCookieName));
        }

        tryCount++;
        sendTime = Date.now();
    });

    rapidocEl.addEventListener('after-try', (e) => {
        let marginTime =  tryCount > 1 ? e.detail.responseStatus ? 12 : 20 : 100;
        let responseTime = Date.now() - sendTime - marginTime;
        let responseTimeElement = document.getElementById("response-time");
        responseTimeElement.innerHTML = "Response Time: " + responseTime + "ms";
    });
});