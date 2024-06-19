import config from "../config.ts";
import { log } from "../utils.ts";

interface Provider {
  chat?(request: string, contents: any, filepath: string, language: string): Promise<any>
  completion?(contents: any, filepath: string, language: string): Promise<any>
}

const providers: Record<string, Provider> = {}

const registerProvider = (key: string, provider: Provider) => {
  providers[key] = provider
}

const getProvider = (key: string): Provider => {
  if (!providers[key]) {
    const error = `no provider: ${key}`
    log(error)
    throw new Error(error)
  }

  return providers[key]
}

const chat = async (...args: any[]) => {
  const handler = config.chatHandler ? config.chatHandler : config.handler
  log(handler, "chat request", JSON.stringify(args))
  const provider = getProvider(handler)

  if (!provider.chat) {
    const error = `No chat provider for: ${handler}`
    log(error)
    throw new Error(error)
  }


  return provider.chat(...args, handler)
}

const completion = async (...args: any[]) => {
  const provider = getProvider(config.handler)

  if (!provider.completion) {
    const error = `No completion provider for: ${config.handler}`
    log(error)
    throw new Error(error)
  }

  return provider.completion(...args)
}

export default { chat, completion, registerProvider }
