
function sendPrompt(prompt, chaos, frequency_penalty) 
{
  try
  {
    // Get token details and baseUri from documentProperties, check to see if the URI needs to use old endpoint or not (depends on the API call and the region)
    var userProperties = PropertiesService.getUserProperties();
    var scriptProperties = PropertiesService.getScriptProperties();
    var token = userProperties.getProperty("token")
    if(token == null)
    {
      var ui = SpreadsheetApp.getUi();
      var result = ui.prompt(
          'Please enter your OpenAI API bearer token:',
          ui.ButtonSet.OK_CANCEL);
      token = result.getResponseText();
      userProperties.setProperty("token",token)
    } 
    const baseUri = "https://api.openai.com/v1"

    // Test Data see at bottom
    //  payload = 
    if (chaos == null)
    {
      chaos = 1
    }
    if (frequency_penalty == null)
    {
      frequency_penalty = 0
    }
    // Adjust payload and endpoint
    var endpoint = baseUri + "/chat/completions";
    var payload = {}
    payload.model = "gpt-3.5-turbo"
    payload.messages = prompt
    payload.n = 1
    payload.frequency_penalty = frequency_penalty
    payload.max_tokens = 3000
                  
    payloadAsJson = JSON.stringify(payload);

    // Set options for API
    var options = {};
    options.muteHttpExceptions = true;
    options.method = "post";
    options.contentType = "application/json";
    options.headers = {
      'Authorization' : 'Bearer ' + token,
      'Accept' : '*/*'
    };
    options.payload = payloadAsJson;

    // Make API Call and process results
    var response = UrlFetchApp.fetch(endpoint, options);
    Logger.log("Method: API_Storyteller \nEndpoint: "+ endpoint + "\nPayload: " +payloadAsJson + "\nHTTP Status: " +response.getResponseCode());
    switch(response.getResponseCode())
    {
      case 200: // Ok - Success, process response
      case 201: // Created - Success, process response
      case 206: // Partial Success
        var json = response.getContentText();
        Logger.log("Response: "+json);
        var data = JSON.parse(json);
        if (data.choices.length == 0)
        {
          Logger.log("Need at least one choice in data.")
        }
        else if (data.choices[0].message.content.length == 0)
        {
          Logger.log("No text in data choice[0].")
        }
        else
        {
          var response = data.choices[0].message.content
          if(response.includes("the the the"))
          {
            response = response.substring(0,response.indexOf("the the the")+3)
            Logger.log(response)
          }
          if(response.includes("a a a"))
          {
            response = response.substring(0,response.indexOf("a a a")+1)
            Logger.log(response)
          }
          if(response.includes("the player the player"))
          {
            response = response.substring(0,response.indexOf("the player the player")+10)
            Logger.log(response)
          }
          
          return response
        }
      case 204: // No Content, nothing to process
        return;
      case 400: // Bad request fix the payload: Invalid campaigns{0}.campaignName - String '' is less than minimum length of 1.
        var json = response.getContentText();
        throw new Error ("Bad Payload: We couldn't generate a response." + json)
      case 401: // Unauthorized, get new token
        throw new Error ("Token was expired, is now refreshed, please try again.")
      case 403: // Security permissions prevent access to data
          throw new Error ("Security permissions prevent access to data:\n" + response.getContentText())
      default: // unhandled status
        throw new Error (response.getContentText())
    }
  }
  catch(err)
  {
    Logger.log(err.stack)
    throw new Error(err.message)
  }
}

function sendDescription(prompt) 
{
  try
  {
    // Get token details and baseUri from documentProperties, check to see if the URI needs to use old endpoint or not (depends on the API call and the region)
    var documentProperties = PropertiesService.getDocumentProperties();
    const token = documentProperties.getProperty("token")
    const baseUri = documentProperties.getProperty("baseURI")

    // Test Data see at bottom
    //  payload = 

    // Adjust payload and endpoint
    var endpoint = baseUri + "/images/generations";
    var payload = {}
    payload.prompt = "Generate a pixel art image of " + prompt.substring(0,900) + ". Please simplify the image to be suitable for a text-based game."
    payload.n = 1
    payload.size = "512x512"
                  
    payloadAsJson = JSON.stringify(payload);

    // Set options for API
    var options = {};
    options.muteHttpExceptions = true;
    options.method = "post";
    options.contentType = "application/json";
    options.headers = {
      'Authorization' : 'Bearer ' + token,
      'Accept' : '*/*'
    };
    options.payload = payloadAsJson;

    // Make API Call and process results
    var response = UrlFetchApp.fetch(endpoint, options);
    Logger.log("Method: API_Paint \nEndpoint: "+ endpoint + "\nPayload: " +payloadAsJson + "\nHTTP Status: " +response.getResponseCode());
    switch(response.getResponseCode())
    {
      case 200: // Ok - Success, process response
      case 201: // Created - Success, process response
      case 206: // Partial Success
        var json = response.getContentText();
        Logger.log("Response: "+json);
        var data = JSON.parse(json);
        if (data.data.length == 0)
        {
          Logger.log("Need at least one choice in response.")
        }
        else
        {
          return data.data[0].url
        }
      case 204: // No Content, nothing to process
        return;
      case 400: // Bad request fix the payload: Invalid campaigns{0}.campaignName - String '' is less than minimum length of 1.
        var json = response.getContentText();
        throw new Error ("Bad Payload: " + json)
      case 401: // Unauthorized, get new token
        throw new Error ("Token was expired, is now refreshed, please try again.")
      case 403: // Security permissions prevent access to data
          throw new Error ("Security permissions prevent access to data:\n" + response.getContentText())
      default: // unhandled status
        Logger.log(response.getContentText())
        throw new Error (response.getContentText())
    }
  }
  catch(err)
  {
    Logger.log(err.stack)
    throw new Error(err.message)
  }
}