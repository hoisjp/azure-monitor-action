import * as core from '@actions/core'
import * as azureMonitor from './azureMonitor'
import * as yaml from 'js-yaml'

async function run(): Promise<void> {
  try {
    // through secret
    const workspaceId: string = core.getInput('workspace-id', {required: true})
    // if (!workspaceId) {
    //   throw new Error("Not all values are present in the creds object. Ensure clientId, clientSecret and tenantId are supplied.");
    // }
    const agentKey: string = core.getInput('agent-key', {required: true})

    // let jsonBody: string = JSON.stringify(yaml.load(core.getInput('log', {required: true})))
    const logMessage = core.getInput('log', {required: true})
    let jsonBody: string = `{log: '${logMessage}'}`

    core.debug('input json:' + jsonBody)

    await azureMonitor.sendLogs(workspaceId, agentKey, jsonBody)

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
