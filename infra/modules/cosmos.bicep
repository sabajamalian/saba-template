targetScope = 'resourceGroup'

@description('Globally unique name for the Azure Cosmos DB account.')
@minLength(3)
param cosmosDbName string

@description('Azure region for the Cosmos DB account and database resources.')
param location string

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: cosmosDbName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
    publicNetworkAccess: 'Enabled'
    enableAutomaticFailover: false
    minimalTlsVersion: 'Tls12'
  }
}

resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  name: 'appdb'
  parent: cosmosAccount
  properties: {
    resource: {
      id: 'appdb'
    }
  }
}

resource usersContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: 'users'
  parent: cosmosDatabase
  properties: {
    resource: {
      id: 'users'
      partitionKey: {
        paths: [
          '/id'
        ]
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        automatic: true
        includedPaths: [
          {
            path: '/*'
          }
        ]
        excludedPaths: [
          {
            path: '/"_etag"/?'
          }
        ]
      }
    }
  }
}

@description('Cosmos DB account document endpoint.')
output endpoint string = cosmosAccount.properties.documentEndpoint

@description('Primary key for the Cosmos DB account.')
@secure()
output primaryKey string = cosmosAccount.listKeys().primaryMasterKey
