import * as core from '@actions/core'
import * as azureMonitor from './azureMonitor'

export async function run(): Promise<void> {
  try {
    // through secret
    const workspaceId: string = core.getInput('workspace-id', {required: true})
    const agentKey: string = core.getInput('agent-key', {required: true})

    const jsonBody = core.getInput('json-body', {required: true})
    core.debug(`input json-body:'${jsonBody}'`)
    // TODO JSON validation

    await azureMonitor.sendLogs(workspaceId, agentKey, jsonBody)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
