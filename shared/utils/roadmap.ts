// shared/utils/roadmap.ts
let stepNumber = 1;

export interface RoadmapStep {
    type: "component" | "middleware" | "api-handler";
    name: string;
    direction: "entrée" | "sortie";
    timestamp?: number;
    context?: Record<string, unknown>;
}

/**
 * Logs a step in the request/response lifecycle for debugging purposes.
 * Works on both server and client, logging to the respective console.
 * @param step - The roadmap step to log.
 */
export function logRoadmapStep(step: RoadmapStep) {
    const entry = {
        ...step,
        timestamp: step.timestamp ?? Date.now(),
        context: {
            ...step.context,
            stepNumber: stepNumber++,
        },
    };

    const icon =
        step.type === "middleware"
            ? "🚦"
            : step.type === "api-handler"
              ? "⚡️"
              : "⚛️";
    const directionIcon = step.direction === "entrée" ? "▶️" : "◀️";

    if (process.env.NODE_ENV !== "production") {
        console.log(
            `[ROADMAP] #${entry.context.stepNumber} ${icon} ${entry.type} - ${entry.name} | ${directionIcon} ${entry.direction}`,
            entry.context ? `| context: ${JSON.stringify(entry.context)}` : ""
        );
    }
}
