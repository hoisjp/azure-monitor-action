import * as core from '@actions/core'
import * as azureMonitor from './azureMonitor'
// import * as yaml from 'js-yaml'

export async function run(): Promise<void> {
  try {
    // through secret
    const workspaceId: string = core.getInput('workspace-id', {required: true})
    const agentKey: string = core.getInput('agent-key', {required: true})

    const jsonBody = core.getInput('log', {required: true})
    core.debug(`input json: ${jsonBody}`)

    await azureMonitor.sendLogs(workspaceId, agentKey, jsonBody)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
