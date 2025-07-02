export async function fetchWithAutoRefresh(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    let response = await fetch(input, init);

    if (response.status === 401) {
        // Tente un refresh avec header spécial
        const refreshRes = await fetch("/api/auth/refresh", {
            headers: { "X-Refresh-Request": "true" },
        });

        // Si le refresh a échoué par redirection (cas navigation)
        if (refreshRes.redirected) {
            const currentUrl =
                window.location.pathname + window.location.search;

            if (typeof window !== "undefined") {
                localStorage.setItem("session-expired-toast", "1");
            }
            window.location.href = `/login?redirectTo=${encodeURIComponent(currentUrl)}`;

            return response;
        }

        // Si le refresh a échoué par 401 JSON (cas AJAX)
        if (refreshRes.status === 401) {
            const currentUrl =
                window.location.pathname + window.location.search;

            if (typeof window !== "undefined") {
                localStorage.setItem("session-expired-toast", "1");
            }
            window.location.href = `/login?redirectTo=${encodeURIComponent(currentUrl)}`;

            return response;
        }

        // Si c'est un JSON { success: true }, on retry
        if (refreshRes.ok) {
            const data = await refreshRes.json().catch(() => null);

            if (data && data.success) {
                response = await fetch(input, init);
            }
        }
    }

    return response;
}
