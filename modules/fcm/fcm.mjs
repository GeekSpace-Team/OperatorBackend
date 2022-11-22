import admin from "firebase-admin";

const serverConfig = {
    "type": "service_account",
    "project_id": "operator-80283",
    "private_key_id": "4c3f9ea2cbdbc5ce190b74fb6331804236a6d49f",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnLfmy3CAc9HXy\nRb4jLeAsK1Tq7LXXUqtpzmje7Pz/67rAaIoee1gK3nuuBobzeNc/umDr8AewCCmS\nPxuuSYhSIVRXgFSALLgrLl+ui0xlhUIJX+Yyewv4AwOpOwPnHTWhSKmELjGQBmd9\nQtHiNbaRDruYcoy/8qA8rVdevHdJmF7gERb1iVvVBXCbKX72xeYkYhHpwj5hNFI7\nptoEWBg3Ut5zobM1GVGTtfiO2Y3YmRolYgy2H6STv9cf89LAyQg3561mIS6wHeSX\nedtFEDh22bjfGYLqGrhG11+AT9j2NnHmQxI+pstuj14i+H/bdR0Z62MGZmmgWO0h\nxW8DtN65AgMBAAECggEAC+17+mwPKdGylUGu7QFJvw0BEYPS/ipf9XwXFQn74QyC\nC1afaB5XwUAaEJKsT98IHdFf4eWDFDxOLv4sAkAtJuL0NWFVZhG1ZXX5Dfx9S7mk\nD67VFIvykNQyOixDkoU4fX8wLQXuCP8T+ia+z8YSS6uCl0AGVRmWn3hPRVXqqDLx\nDR5nNjftd5f0NTd/kfzF2Bp34Tr/tgncCZRR8yRPSjPSLvg5AD8oHQ+v5mxaliep\noyfcpJU1ymaA+2rjLbuJOGWtX3gEY0tsYB3WmwtGIf5SfCjX04OD91KIWlWMceGD\naHqZ5CcdnM59keVc2DNAl0Hf/3XflI+0w3DP0avSKQKBgQDhV6qiUOeqSp5FBSVR\neNFof7TSgRCQy/Mtl9bpsAWCuD44XhUOtQavxE91f8G78SlAPe9tb9dtaJjMHFZe\nztVQOSWofPo8eP/IjgXTTsy881CzlLwGo6cm1CdXQGLN/DBBKzoUwBW8AbaOwWpC\n5ykHmXzR+ih6KMN7sb74joo7BQKBgQC97JXZxvYLGcc9QsIdn+GJ1PLj3aoB1zJN\nRHbqEl8ibiqEsslHhNYkM+B6WQS64/cFZPO960mEpsUl5oXVEs7rowV7t/Ax/Zq4\nK+W028fPy5joifBaHonciW1RwiKQRwzO8GpcQIadrZLUH4WsxIzdPKBbQ+3oU2yZ\nsqkXYHarJQKBgQCzfqxJrN5L1DIr0kR+mBld/tOfFfWHER38REWJUY+iJ3ZQWgi1\n9VaFLX8JniFIvnlYVb1g08SqvrVvaGcYD/L0ewDXK+37u3orW42iWtNU8w9mbGQ1\neahMkpNfuca6Q1aAopkaLENjxY2QOtqUviL9jbJSY8xYOh40akovHQNYrQKBgCPK\n9YbAX1hCOHFMJocsvXWbY1ccTFDifIFhWMPOSI2Vk3/ErfhDiZPzDugf5KtQERq8\nJs9xCz7rqxX0dt5sGAECjSL+zE6vi7wP0c+e5+46YYvZiymAvdyJLcgNvTPRoBFT\n78eJBZWrw5Mkia3AsQd0yIfKqohxSHNC32kfbd3dAoGASWnet57zqz2YqV04GQLq\nf8I9+4/qCNgq/z0z5W+ZxUqM/46XnKcZwSpgOv2/w+e9pF7ciW+e/V++J2aI0h3U\nXPWCVHzzc7i8qk/AfgAYVbWH6wS+czzbM3Mg/8AwzcQFwyGua8ApMNM6+zuY9+on\n4IjVO3Bv/XWAcHZ+aPHEdCc=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-dpxmm@operator-80283.iam.gserviceaccount.com",
    "client_id": "112053908930504231933",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dpxmm%40operator-80283.iam.gserviceaccount.com"
}



admin.initializeApp({
    credential: admin.credential.cert(serverConfig)
  })

export const pusher=admin;
