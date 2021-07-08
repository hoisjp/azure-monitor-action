import * as core from '@actions/core'
import * as httpClient from '@actions/http-client'
import * as cryptoJs from 'crypto-js'

// see this sample https://docs.microsoft.com/en-us/azure/azure-monitor/logs/data-collector-api
export function buildAuthorization(
  workspaceId: string,
  sharedKey: string,
  date: string,
  contentLength: number,
  method: string,
  contentType: string,
  resource: string
): string {
  const xHeaders = `x-ms-date: ${date}`
  const lf = '\n'
  const stringToHash = `${
    method +
    lf +
    contentLength.toString() +
    lf +
    contentType +
    lf +
    xHeaders +
    lf +
    resource
  }`
  core.debug(`stringToHash: ${stringToHash}`)
  // Signature=Base64(HMAC-SHA256(UTF8(StringToSign)))
  const signature = cryptoJs
    .HmacSHA256(stringToHash, cryptoJs.enc.Base64.parse(sharedKey))
    .toString(cryptoJs.enc.Base64)
  const authorization = `SharedKey ${workspaceId}:${signature}`
  core.debug(`authorization: ${authorization}`)
  return authorization
}

export async function sendLogs(
  workspaceId: string,
  sharedKey: string,
  body: string
): Promise<void> {
  const logDate = new Date().toUTCString()
  const method = 'POST'
  const contentType = 'application/json'
  const resource = '/api/logs'

  const authorization = buildAuthorization(
    workspaceId,
    sharedKey,
    logDate,
    body.length,
    method,
    contentType,
    resource
  )

  const http: httpClient.HttpClient = new httpClient.HttpClient(
    'azmon-http-client',
    [],
    {
      headers: {
        Authorization: authorization,
        'Content-Type': contentType,
        'Log-Type': 'GitHubAction',
        'x-ms-date': logDate
      }
    }
  )
  let errors = 0

  const url = `https://${workspaceId}.ods.opinsights.azure.com/api/logs?api-version=2016-04-01`

  core.debug(`About to send ${body} events`)
  const res: httpClient.HttpClientResponse = await http.post(url, body)
  if (res.message.statusCode === undefined || res.message.statusCode >= 400) {
    errors++
    core.error(`HTTP request failed: ${res.message.statusMessage}`)
  }

  if (errors > 0) {
    throw new Error(`Failed sending ${errors} out of ${body}`)
  }
}
