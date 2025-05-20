// Chat Entity basé sur l'exemple Python fourni

export interface ChatFormation {
    title: string;
    level: string;
    domain_mention: string;
    duration_months?: number;
    authorization_status: string;
}

export interface ChatFoundData {
    establishment_name: string;
    establishment_acronym: string;
    type: string;
    sector: string;
    address: string;
    formations: ChatFormation[];
}

export interface ChatResponseData {
    assistant_message: string;
    found_data: ChatFoundData[];
    clarification_question: string | null;
}

export interface ChatResponse {
    userId: number;
    response: ChatResponseData;
    history: string[];
}

export interface ChatHistoryResponse {
    userId: number;
    history: string[];
}

export interface ChatInput {
    message: string;
}

export class ChatEntity {
    static fromResponse(data: unknown): ChatResponse {
        if (typeof data !== "object" || data === null) {
            throw new Error("Invalid data for ChatResponse");
        }
        const obj = data as Record<string, unknown>;

        // Mapping response
        let response: ChatResponseData = {
            assistant_message: "",
            found_data: [],
            clarification_question: null,
        };

        if (typeof obj.response === "object" && obj.response !== null) {
            const resp = obj.response as Record<string, unknown>;

            response = {
                assistant_message:
                    typeof resp.assistant_message === "string"
                        ? resp.assistant_message
                        : "",
                found_data: Array.isArray(resp.found_data)
                    ? (resp.found_data
                          .map((fd) => {
                              if (typeof fd !== "object" || fd === null)
                                  return null;
                              const fdo = fd as Record<string, unknown>;

                              return {
                                  establishment_name:
                                      typeof fdo.establishment_name === "string"
                                          ? fdo.establishment_name
                                          : "",
                                  establishment_acronym:
                                      typeof fdo.establishment_acronym ===
                                      "string"
                                          ? fdo.establishment_acronym
                                          : "",
                                  type:
                                      typeof fdo.type === "string"
                                          ? fdo.type
                                          : "",
                                  sector:
                                      typeof fdo.sector === "string"
                                          ? fdo.sector
                                          : "",
                                  address:
                                      typeof fdo.address === "string"
                                          ? fdo.address
                                          : "",
                                  formations: Array.isArray(fdo.formations)
                                      ? (fdo.formations
                                            .map((form) => {
                                                if (
                                                    typeof form !== "object" ||
                                                    form === null
                                                )
                                                    return null;
                                                const fo = form as Record<
                                                    string,
                                                    unknown
                                                >;

                                                return {
                                                    title:
                                                        typeof fo.title ===
                                                        "string"
                                                            ? fo.title
                                                            : "",
                                                    level:
                                                        typeof fo.level ===
                                                        "string"
                                                            ? fo.level
                                                            : "",
                                                    domain_mention:
                                                        typeof fo.domain_mention ===
                                                        "string"
                                                            ? fo.domain_mention
                                                            : "",
                                                    duration_months:
                                                        typeof fo.duration_months ===
                                                        "number"
                                                            ? fo.duration_months
                                                            : undefined,
                                                    authorization_status:
                                                        typeof fo.authorization_status ===
                                                        "string"
                                                            ? fo.authorization_status
                                                            : "",
                                                };
                                            })
                                            .filter(Boolean) as ChatFormation[])
                                      : [],
                              };
                          })
                          .filter(Boolean) as ChatFoundData[])
                    : [],
                clarification_question:
                    typeof resp.clarification_question === "string" ||
                    resp.clarification_question === null
                        ? resp.clarification_question
                        : null,
            };
        }

        return {
            userId:
                typeof obj.userId === "number"
                    ? obj.userId
                    : typeof obj.user_id === "number"
                      ? obj.user_id
                      : 0,
            response,
            history: Array.isArray(obj.history)
                ? (obj.history.filter((h) => typeof h === "string") as string[])
                : [],
        };
    }

    static fromHistory(data: unknown): ChatHistoryResponse {
        if (typeof data !== "object" || data === null) {
            throw new Error("Invalid data for ChatHistoryResponse");
        }
        const obj = data as Record<string, unknown>;

        return {
            userId:
                typeof obj.userId === "number"
                    ? obj.userId
                    : typeof obj.user_id === "number"
                      ? obj.user_id
                      : 0,
            history: Array.isArray(obj.history)
                ? (obj.history.filter((h) => typeof h === "string") as string[])
                : [],
        };
    }
}
