import React, { PropsWithChildren } from "react";
import { SessionProvider as Provider } from "next-auth/react";

function SessionProvider({ children }: PropsWithChildren) {
    return <Provider>{children}</Provider>;
}

export default SessionProvider;
