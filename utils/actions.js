"use server";

import { generateObject, generateText } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function getPositions(input) {
  "use server";

  const { object: positions } = await generateObject({
    model: google("gemini-1.5-flash-latest"),
    system:
      "You generate a latitude and longtitute for a REAL ESTATE, LISTING, RENTAL, or VACATIONAL property based on the address/prompt.",
    prompt: input,
    schema: z.object({
      positions: z.array(
        z.object({
          latitude: z.number().describe("The latitude of the place."),
          longitude: z.number().describe("The longitude of the place."),
        })
      ),
    }),
  });

  return { positions };
}

export async function getSummary(input) {
  "use server";

  const { text: summary } = await generateText({
    model: google("gemini-1.5-flash-latest"),
    system:
      "You generate a REALLY SIMPLE summary and benefits (as a property) from a place that is inside a coordinate object. The coordinate object has a east, north, south, and west coordinate. ONLY GENERATE TEXT, NO MARKDOWNS/HTML.",
    prompt: input,
    schema: z.string().describe("The summary of the place inside the bounds."),
  });

  return { summary };
}
