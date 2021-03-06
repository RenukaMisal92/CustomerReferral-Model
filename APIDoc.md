# Service Interface Specification for CustomerReferral-Model
    Version 1.0
    Renuka Misal
    30th Dec, 2016

# Introduction
    Customer Referral-Model is designed for increasing the market presence of company by implementing a new referral strategy with node.js and express framework with mongoDB as Database.
    Strategy is Customers can refer multiple person under him and 30% of the account joining fees of new customer will be added  as a payback to referral.


# List of API
    Customer Referral-Model  are categorized into
    Add Customer
    Get Customer By Id
    Add Referral
    Get all Referral
    Get count of Referrals
    Convert Customer into Ambassador
    Add Ambassador
    Get all children of ambassador
    Get children of ambassador at nth level


# Add Customer
    Summary - Adds a new customer in companies records.
    URI -  /custome
    Method : HTTP POST
    Request Content-Type application/json
    Request
    {
     "email": "renuka.misal@gmail.com"
    }
    Response Content-Type - application/json
    
    Response
    200 Success
    {
    "statusCode": 200,
    "message": "Customer added successfully and customer_id is 17"
    }
    
    500   Internal Server Error
  
  
# Get Customer By Id
    Summary - Gets the customers details by cutomer_id
    
    URI -  /customer/:id
    
    Method :HTTP GET
    
    Request Content-Type : None
  
    Response Content-Type -  application/json
    Responses : 
    
    200 Success
    {
      "_id": "583ecedc66217c17872409d7",
      "customer_id": "16",
      "email": "renuka.misal34@gmail.com",
      "__v": 0,
      "lastUpdated": "2016-11-30T13:06:36.059Z",
      "joiningDate": "2016-11-30T13:06:36.059Z",
      "parentAmbassadors": [],
      "isAmbassador": true,
      "payback": 0
    }
    
    404 Not found
    {
      "statusCode": 404,
      "message": "Sorry, entered customerId not found in records."
    }
    
    
     500   Internal Server Error
     
     
# Add Referral
    Summary - Adds referral under an existing customer
    
    URI -  /customer/referral
    
    Method  - HTTP POST
    
    Request Content-Type application/json
    
    Request Body : {
       "email": "renuk.misal92@gmail.com",
        "referral_id" : 2
    }
    
    Response Content-Type - application/json
    
    Response
    200 Success
    {
      "statusCode": "200",
      "message": "Referral added successfully."
    }
    {
      "statusCode": 200,
      "message": "Sorry customer is already registered with this email."
    }
    
    404 Not found : {
    "statusCode": "404",
      "message": "Sorry, No referrals found under this referral id."
    }
    
    500   Internal Server Error



# Get all Referral
    Summary - Gets all referral under a customer_id
    
    URI - /customer/:id/referral
    
    Method  - HTTP GET
    
    Response Content-Type - application/json
    
    Response -
    200 Success
      {
        "statusCode": "200",
        "message": [
          {
            "customer_id": "5",
            "email": "renuk.md3ss2s3jsddss2d4.com",
            "referral_id": "3",
            "lastUpdated": "2016-11-30T06:54:33.833Z",
            "joiningDate": "2016-11-30T06:54:33.833Z",
            "isAmbassador": false
          }
        ]
      }
     
    
    404 Not found : 
        {
           "statusCode": "404",
           "message": "Sorry, entered customerId not found in records."
         }
     
     500   Internal Server Error


# Get count of Referrals
    Summary - Gets count of referral under a customer_id
    
    URI - /customer/:id/referral/count
    
    Method  - HTTP GET
    
    Response Content-Type - application/json
    
    Response -
    200 Success
    {
      "statusCode": "200",
      "message": "Customer_id 2 has 6 referrals count."
    }
    
    404 Not found : {
      "statusCode": "404",
      "message": "Sorry, No referrals found under this referral id."
    }
    
     500   Internal Server Error


# Convert Customer into Ambassador    
    Summary - Convert a customer as ambassador for entered customer_id
    
    URI -   /customer/:id
    
    Method  - HTTP PUT
    
    Response Content-Type - application/json
    
    Response -
    200 Success
       {
         "statusCode": "201",
         "message": "Customer updated successfully for ambassador customer"
       }
    
    
    404 Not found : 
        {
          "statusCode": "404",
          "message": "Sorry, entered customerId not found in records."
        }
    
     500   Internal Server Error


# Add Ambassador
    Summary - Add a customer as a ambassador
    
    URI - /ambassador
    
    Method  - HTTP POST
    
    Response Content-Type - application/json
    
    Request Content-Type application/json
    
    Request Body : {
       "email": "renuk.misal92@gmail.com"
    }

    Response -
    200 Success
        {
         "statusCode": 200,
         "message": "Ambassador added successfully and customer_id is 19"
        }
        {
          "statusCode": 200,
          "message": "Sorry customer is already registered with this email."
        }
    
     500   Internal Server Error


# Get all children of ambassador
    Summary - Gets all children of ambassador with customer_id
    
    URI - /ambassador/:id/all
    
    Method  - HTTP GET
    
    Response Content-Type - application/json
    
    Response -
    200 Success
        {
          "statusCode": "200",
          "message": [
            {
              "customer_id": "3",
              "email": "renuk.mdis2s3jsddss2d4.com",
              "referral_id": "2",
              "lastUpdated": "2016-11-30T06:54:33.838Z",
              "joiningDate": "2016-11-30T06:52:36.380Z",
              "isAmbassador": true
            }
          ]
        }
    
    404 Not found : 
        {
          "statusCode": "404",
          "message": "Sorry, entered customerId not found in records."
        }
    
     500   Internal Server Error


# Get children of ambassador at nth level
    Summary - Gets children of ambassador at nth level with customer_id
    
    URI - /ambassador/:id?level=1
    
    Method  - HTTP GET
    
    Response Content-Type - application/json
    
    Response -
    200 Success
        {
          "statusCode": "200",
          "message": [
            {
              "customer_id": "5",
              "email": "renuk.md3ss2s3jsddss2d4.com",
              "referral_id": "3",
              "lastUpdated": "2016-11-30T06:54:33.833Z",
              "joiningDate": "2016-11-30T06:54:33.833Z",
              "isAmbassador": false
            }
          ]
        }
    
    404 Not found : 
        {
          "statusCode": "404",
          "message": "Sorry, No referrals found under this referral id with expected level of childs."
        }
        
        {
          "statusCode": "404",
          "message": "Customer is not a ambassador"
        }
    
     500   Internal Server Error