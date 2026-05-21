targetScope = 'subscription'

@description('Azure region where shared infrastructure resources will be deployed.')
param location string = 'eastus'

@description('Short environment name used to derive resource names such as the resource group name.')
@minLength(2)
param environmentName string

@description('Globally unique name for the Azure Cosmos DB account.')
@minLength(3)
param cosmosDbName string

@description('Name of the Linux App Service plan.')
@minLength(2)
param appServicePlanName string

@description('Globally unique name of the web application.')
@minLength(2)
param webAppName string

var resourceGroupName = 'rg-${environmentName}'
var cosmosDatabaseName = 'appdb'

resource resourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
}

module cosmos './modules/cosmos.bicep' = {
  name: 'cosmos-${environmentName}'
  scope: resourceGroup
  params: {
    cosmosDbName: cosmosDbName
    location: location
  }
}

module appservice './modules/appservice.bicep' = {
  name: 'appservice-${environmentName}'
  scope: resourceGroup
  params: {
    appServicePlanName: appServicePlanName
    webAppName: webAppName
    location: location
    cosmosEndpoint: cosmos.outputs.endpoint
    cosmosKey: cosmos.outputs.primaryKey
    cosmosDatabaseName: cosmosDatabaseName
  }
}

@description('Name of the resource group created for this environment.')
output resourceGroupName string = resourceGroup.name

@description('Default hostname of the deployed web application.')
output webAppHostName string = appservice.outputs.defaultHostName
