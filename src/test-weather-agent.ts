import "dotenv/config";
import { mastra } from "./mastra/index.js";

const agent = mastra.getAgent('weatherAgent')

const response = await agent.generate("What is the weather in London?");

console.log(response.text);
