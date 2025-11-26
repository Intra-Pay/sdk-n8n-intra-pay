import type { IExecuteFunctions, INodeExecutionData, INodeProperties, INodeType, INodeTypeDescription, IDataObject } from 'n8n-workflow'
import { NodeApiError, NodeOperationError } from 'n8n-workflow'

export class IntraPay implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Intra Pay Brazilian Payments',
    name: 'intraPay',
    group: ['transform'],
    version: 1,
    description: 'Integração com a API financeira da Intra Pay usando intrapay-sdk',
    icon: 'file:logo-intra-pay.svg',
    defaults: { name: 'Intra Pay Brazilian Payments' },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [{ name: 'intraPayApi', required: true }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        default: 'pixCashIn',
        options: [
          { name: 'Pix Cash In', value: 'pixCashIn' },
          { name: 'Pix Cash Out', value: 'pixCashOut' }
        ]
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['pixCashIn', 'pixCashOut'] } },
        default: 'createStaticCharge',
        options: [
          { name: 'Create Static Charge', value: 'createStaticCharge' },
          { name: 'Create Dynamic Immediate Charge', value: 'createDynamicImmediateCharge' },
          { name: 'Get Charge Status', value: 'getChargeStatus' },
          { name: 'Pay By Account', value: 'payByAccount' },
          { name: 'Pay By EMV', value: 'payByEmv' },
          { name: 'Pay By Key', value: 'payByKey' }
        ]
      },
      {
        displayName: 'Pix Key ID',
        name: 'pixKeyId',
        type: 'string',
        displayOptions: { show: { operation: ['createStaticCharge', 'createDynamicImmediateCharge'], resource: ['pixCashIn'] } },
        default: ''
      },
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        displayOptions: { show: { operation: ['createStaticCharge', 'createDynamicImmediateCharge'], resource: ['pixCashIn'] } },
        default: 0
      },
      {
        displayName: 'Additional Information',
        name: 'additionalInformation',
        type: 'string',
        displayOptions: { show: { operation: ['createStaticCharge'], resource: ['pixCashIn'] } },
        default: ''
      },
      {
        displayName: 'Payer Question',
        name: 'payerQuestion',
        type: 'string',
        displayOptions: { show: { operation: ['createDynamicImmediateCharge'], resource: ['pixCashIn'] } },
        default: ''
      },
      {
        displayName: 'Expiration Minutes',
        name: 'expirationMinutes',
        type: 'number',
        displayOptions: { show: { operation: ['createDynamicImmediateCharge'], resource: ['pixCashIn'] } },
        default: 60
      },
      {
        displayName: 'Debtor Name',
        name: 'debtorName',
        type: 'string',
        displayOptions: { show: { operation: ['createDynamicImmediateCharge'], resource: ['pixCashIn'] } },
        default: ''
      },
      {
        displayName: 'Debtor Tax ID',
        name: 'debtorTaxId',
        type: 'string',
        displayOptions: { show: { operation: ['createDynamicImmediateCharge'], resource: ['pixCashIn'] } },
        default: ''
      },
      {
        displayName: 'Transaction ID',
        name: 'txId',
        type: 'string',
        displayOptions: { show: { operation: ['getChargeStatus'], resource: ['pixCashIn'] } },
        default: ''
      },
      {
        displayName: 'Account',
        name: 'account',
        type: 'string',
        displayOptions: { show: { operation: ['payByAccount'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Branch',
        name: 'branch',
        type: 'string',
        displayOptions: { show: { operation: ['payByAccount'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Bank (ISPB)',
        name: 'bank',
        type: 'string',
        displayOptions: { show: { operation: ['payByAccount'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Tax ID',
        name: 'taxId',
        type: 'string',
        displayOptions: { show: { operation: ['payByAccount'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        displayOptions: { show: { operation: ['payByAccount'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Account Type',
        name: 'accountType',
        type: 'options',
        options: [
          { name: 'CACC', value: 'CACC' },
          { name: 'TRAN', value: 'TRAN' },
          { name: 'SLRY', value: 'SLRY' },
          { name: 'SVGS', value: 'SVGS' }
        ],
        displayOptions: { show: { operation: ['payByAccount'], resource: ['pixCashOut'] } },
        default: 'CACC'
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        displayOptions: { show: { operation: ['payByAccount'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Password',
        name: 'password',
        type: 'string',
        typeOptions: { password: true },
        displayOptions: { show: { operation: ['payByAccount'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'EMV Type',
        name: 'emvType',
        type: 'options',
        options: [
          { name: 'STATIC_QRCODE', value: 'STATIC_QRCODE' },
          { name: 'IMMEDIATE_QRCODE', value: 'IMMEDIATE_QRCODE' },
          { name: 'DUEDATE_QRCODE', value: 'DUEDATE_QRCODE' }
        ],
        displayOptions: { show: { operation: ['payByEmv'], resource: ['pixCashOut'] } },
        default: 'STATIC_QRCODE'
      },
      {
        displayName: 'End To End ID',
        name: 'endToEndId',
        type: 'string',
        displayOptions: { show: { operation: ['payByEmv'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Amount Original (cents)',
        name: 'amountOriginal',
        type: 'number',
        displayOptions: { show: { operation: ['payByEmv'], resource: ['pixCashOut'] } },
        default: 0
      },
      {
        displayName: 'Amount Final (cents)',
        name: 'amountFinal',
        type: 'number',
        displayOptions: { show: { operation: ['payByEmv'], resource: ['pixCashOut'] } },
        default: 0
      },
      {
        displayName: 'Receiver Name',
        name: 'receiverName',
        type: 'string',
        displayOptions: { show: { operation: ['payByEmv'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Receiver Participant',
        name: 'receiverParticipant',
        type: 'string',
        displayOptions: { show: { operation: ['payByEmv'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Receiver Document',
        name: 'receiverDocumentNumber',
        type: 'string',
        displayOptions: { show: { operation: ['payByEmv'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Key',
        name: 'key',
        type: 'string',
        displayOptions: { show: { operation: ['payByKey'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Key Type',
        name: 'keyType',
        type: 'options',
        options: [
          { name: 'EVP', value: 'EVP' },
          { name: 'CPF', value: 'CPF' },
          { name: 'CNPJ', value: 'CNPJ' },
          { name: 'EMAIL', value: 'EMAIL' },
          { name: 'PHONE', value: 'PHONE' }
        ],
        displayOptions: { show: { operation: ['payByKey'], resource: ['pixCashOut'] } },
        default: 'EVP'
      },
      {
        displayName: 'End To End ID',
        name: 'keyEndToEndId',
        type: 'string',
        displayOptions: { show: { operation: ['payByKey'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Account Participant',
        name: 'accountParticipant',
        type: 'string',
        displayOptions: { show: { operation: ['payByKey'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Account Branch',
        name: 'accountBranch',
        type: 'string',
        displayOptions: { show: { operation: ['payByKey'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Account Number',
        name: 'accountNumber',
        type: 'string',
        displayOptions: { show: { operation: ['payByKey'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Owner Name',
        name: 'ownerName',
        type: 'string',
        displayOptions: { show: { operation: ['payByKey'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Owner Type',
        name: 'ownerType',
        type: 'options',
        options: [
          { name: 'NATURAL_PERSON', value: 'NATURAL_PERSON' },
          { name: 'LEGAL_PERSON', value: 'LEGAL_PERSON' }
        ],
        displayOptions: { show: { operation: ['payByKey'], resource: ['pixCashOut'] } },
        default: 'NATURAL_PERSON'
      },
      {
        displayName: 'Owner Trade Name',
        name: 'ownerTradeName',
        type: 'string',
        displayOptions: { show: { operation: ['payByKey'], resource: ['pixCashOut'] } },
        default: ''
      },
      {
        displayName: 'Owner Document',
        name: 'ownerDocumentNumber',
        type: 'string',
        displayOptions: { show: { operation: ['payByKey'], resource: ['pixCashOut'] } },
        default: ''
      }
    ]
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const returnData: INodeExecutionData[] = []
    const credentials = await this.getCredentials('intraPayApi')
    const baseUrl = (credentials.baseUrl as string) || 'https://api.intrapay.io/api/financial/v1'
    const { IntraPayClient } = await import('intrapay-sdk')
    const client = new IntraPayClient({ clientKey: credentials.clientKey as string, clientSecret: credentials.clientSecret as string, baseUrl })
    await client.ensureAuthenticated()

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string
        const operation = this.getNodeParameter('operation', i) as string
        if (resource === 'pixCashIn' && operation === 'createStaticCharge') {
          const pixKeyId = this.getNodeParameter('pixKeyId', i) as string
          const amount = this.getNodeParameter('amount', i) as number
          const additionalInformation = this.getNodeParameter('additionalInformation', i) as string
          const data = await client.cashIn.createStaticCharge({ pixKeyId, amount, additionalInformation })
          returnData.push({ json: data as unknown as IDataObject })
        } else if (resource === 'pixCashIn' && operation === 'createDynamicImmediateCharge') {
          const pixKeyId = this.getNodeParameter('pixKeyId', i) as string
          const amount = this.getNodeParameter('amount', i) as number
          const expirationMinutes = this.getNodeParameter('expirationMinutes', i) as number
          const debtorName = this.getNodeParameter('debtorName', i) as string
          const debtorTaxId = this.getNodeParameter('debtorTaxId', i) as string
          const payerQuestion = this.getNodeParameter('payerQuestion', i) as string
          const data = await client.cashIn.createImmediateCharge({
            pixKeyId,
            amount,
            additionalInformation: [],
            debtor: { name: debtorName, taxId: debtorTaxId },
            payerQuestion,
            expiration: { value: expirationMinutes, unit: 'minutes' }
          })
          returnData.push({ json: data as unknown as IDataObject })
        } else if (resource === 'pixCashIn' && operation === 'getChargeStatus') {
          const txId = this.getNodeParameter('txId', i) as string
          throw new NodeOperationError(this.getNode(), `Operação de consulta de status não disponível nesta versão. txId: ${txId}`)
        } else if (resource === 'pixCashOut' && operation === 'payByAccount') {
          const account = this.getNodeParameter('account', i) as string
          const branch = this.getNodeParameter('branch', i) as string
          const bank = this.getNodeParameter('bank', i) as string
          const amount = this.getNodeParameter('amount', i) as number
          const taxId = this.getNodeParameter('taxId', i) as string
          const name = this.getNodeParameter('name', i) as string
          const accountType = this.getNodeParameter('accountType', i) as string
          const description = this.getNodeParameter('description', i) as string
          const password = this.getNodeParameter('password', i) as string
          const data = await client.cashOut.payByAccount({ account, branch, bank, amount, taxId, name, accountType: accountType as any, description, password })
          returnData.push({ json: data as unknown as IDataObject })
        } else if (resource === 'pixCashOut' && operation === 'payByEmv') {
          const type = this.getNodeParameter('emvType', i) as string
          const endToEndId = this.getNodeParameter('endToEndId', i) as string
          const amountOriginal = this.getNodeParameter('amountOriginal', i) as number
          const amountFinal = this.getNodeParameter('amountFinal', i) as number
          const receiverName = this.getNodeParameter('receiverName', i) as string
          const receiverParticipant = this.getNodeParameter('receiverParticipant', i) as string
          const receiverDocumentNumber = this.getNodeParameter('receiverDocumentNumber', i) as string
          const data = await client.cashOut.payByEmv({
            type: type as any,
            endToEndId,
            amount: { original: amountOriginal, final: amountFinal },
            receiver: { name: receiverName, participant: receiverParticipant, documentNumber: receiverDocumentNumber }
          } as any)
          returnData.push({ json: data as unknown as IDataObject })
        } else if (resource === 'pixCashOut' && operation === 'payByKey') {
          const key = this.getNodeParameter('key', i) as string
          const keyType = this.getNodeParameter('keyType', i) as string
          const endtoEndId = this.getNodeParameter('keyEndToEndId', i) as string
          const accountParticipant = this.getNodeParameter('accountParticipant', i) as string
          const accountBranch = this.getNodeParameter('accountBranch', i) as string
          const accountNumber = this.getNodeParameter('accountNumber', i) as string
          const ownerName = this.getNodeParameter('ownerName', i) as string
          const ownerType = this.getNodeParameter('ownerType', i) as string
          const ownerTradeName = this.getNodeParameter('ownerTradeName', i) as string
          const ownerDocumentNumber = this.getNodeParameter('ownerDocumentNumber', i) as string
          const data = await client.cashOut.payByKey({
            key,
            keyType: keyType as any,
            endtoEndId,
            account: { participant: accountParticipant, accountType: 'CACC' as any, branch: accountBranch, account: accountNumber },
            owner: { name: ownerName, type: ownerType as any, tradeName: ownerTradeName, documentNumber: ownerDocumentNumber }
          })
          returnData.push({ json: data as unknown as IDataObject })
        } else {
          throw new NodeOperationError(this.getNode(), 'Operação não suportada')
        }
      } catch (error) {
        if (error instanceof NodeOperationError) throw error
        const e: any = error
        throw new NodeApiError(this.getNode(), e?.response?.data ?? { message: e?.message ?? 'Unknown error' })
      }
    }

    return [returnData]
  }
}