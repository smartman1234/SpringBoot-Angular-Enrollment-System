window.addEventListener("DOMContentLoaded", (event) => {
    /*
      Ensure that the DOM is loaded, then add the event listener.
      here we are listening to "before-try" event which fires when the user clicks
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
                let name = cookies[i].split("=")[0].trim();
                let value = cookies[i].split("=")[1];
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
            const cookieValue = getCookie(csrfTokenCookieName);
            e.detail.request.headers.append(csrfTokenHeaderName, cookieValue);
        }

        tryCount++;
        sendTime = Date.now();
    });

    rapidocEl.addEventListener("after-try", (e) => {
        let marginTime = tryCount > 1 ? e.detail.responseStatus ? 12 : 20 : 100;
        let responseTime = Date.now() - sendTime - marginTime;
        let responseTimeElement = document.getElementById("response-time");
        responseTimeElement.innerHTML = "Response Time: " + responseTime + "ms";
    });

    document.getElementById("btn1").addEventListener("click", () => {
        rapidocEl.setAttribute("spec-url", "https://localhost:8443/v3/api-docs/enrollmentsystem-user")
    });

    document.getElementById("btn2").addEventListener("click", () => {
        rapidocEl.setAttribute("spec-url", "https://localhost:8443/v3/api-docs/enrollmentsystem-admin")
    });

    document.getElementById("btn3").addEventListener("click", () => {
        rapidocEl.setAttribute("spec-url", "https://localhost:8443/v3/api-docs")
    });

    document.getElementById("btn4").addEventListener("click", () => {
        rapidocEl.setAttribute("use-path-in-nav-bar", "true")
    });

    document.getElementById("btn5").addEventListener("click", () => {
        rapidocEl.setAttribute("use-path-in-nav-bar", "false")
    });
});