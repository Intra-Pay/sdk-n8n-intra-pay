import type { ICredentialType, INodeProperties } from 'n8n-workflow'

export class IntraPayApi implements ICredentialType {
  name = 'intraPayApi'
  displayName = 'IntraPay API'
  properties: INodeProperties[] = [
    {
      displayName: 'Client Key',
      name: 'clientKey',
      type: 'string',
      default: ''
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: { password: true },
      default: ''
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.intrapay.io/api/financial/v1'
    }
  ]
}