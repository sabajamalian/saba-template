targetScope = 'resourceGroup'

@description('Name of the Linux App Service plan.')
@minLength(2)
param appServicePlanName string

@description('Globally unique name of the web application.')
@minLength(2)
param webAppName string

@description('Azure region for the App Service resources.')
param location string

@description('Cosmos DB account endpoint used by the application.')
param cosmosEndpoint string

@description('Primary key for the Cosmos DB account.')
@secure()
@minLength(10)
param cosmosKey string

@description('Cosmos DB SQL database name used by the application.')
@minLength(3)
param cosmosDatabaseName string

var jwtSecret = 'jwt-${uniqueString(subscription().subscriptionId, resourceGroup().id, webAppName)}'
var cosmosConnectionString = 'AccountEndpoint=${cosmosEndpoint};AccountKey=${cosmosKey};Database=${cosmosDatabaseName};'

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: 'B1'
    tier: 'Basic'
    size: 'B1'
    family: 'B'
    capacity: 1
  }
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: webAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        {
          name: 'COSMOS_ENDPOINT'
          value: cosmosEndpoint
        }
        {
          name: 'COSMOS_KEY'
          value: cosmosKey
        }
        {
          name: 'COSMOS_DATABASE'
          value: cosmosDatabaseName
        }
        {
          name: 'COSMOS_CONNECTION_STRING'
          value: cosmosConnectionString
        }
        {
          name: 'JWT_SECRET'
          value: jwtSecret
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
      ]
    }
  }
}

@description('Default hostname of the deployed web application.')
output defaultHostName string = webApp.properties.defaultHostName
