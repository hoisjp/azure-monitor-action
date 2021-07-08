import * as azureMonitor from '../src/azureMonitor'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as core from '@actions/core'
import {run} from '../src/main'
jest.mock('../src/azureMonitor')

describe('unit-tests', () => {
  let outSpy: jest.SpyInstance

  beforeEach(() => {
    process.env['INPUT_LA_WORKSPACE_ID'] = 'fooBar'
    outSpy = jest.spyOn(process.stdout, 'write')
  })

  afterEach(() => {
    outSpy.mockClear()
    jest.clearAllMocks()
  })

  test('workspace-id input param must be set', async () => {
    process.env['INPUT_LA_WORKSPACE_ID'] = ''
    await run()
    expect(azureMonitor.sendLogs).toHaveBeenCalledTimes(0)
    expect(outSpy).toHaveBeenCalledWith(
      '::error::Input required and not supplied: workspace-id\n'
    )
  })
})
