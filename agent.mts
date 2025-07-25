import dotenv from "dotenv";
import { TavilySearch } from "@langchain/tavily";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

dotenv.config();


// Define the tools for the agent to use
const agentTools = [
    new TavilySearch(),
];

const agentModel = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
});

// Initialize memory to persist state between graph runs

const agentCheckPoint = new MemorySaver();

const agent = createReactAgent({
    llm: agentModel,
    tools: agentTools,
    checkpointSaver: agentCheckPoint,
});

const agentFinalState = await agent.invoke(
    { messages: [new HumanMessage("what is the current weather in sf")] },
    { configurable: { thread_id: "42" } },
);

console.log(
    agentFinalState.messages[agentFinalState.messages.length - 1].content,
);


const agentNextState = await agent.invoke(
    { messages: [new HumanMessage("what about tokyo?")] },
    { configurable: { thread_id: "42" } },
);

console.log(
    agentNextState.messages[agentNextState.messages.length - 1].content,
);