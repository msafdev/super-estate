"use server";

import { generateObject } from "ai";
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
