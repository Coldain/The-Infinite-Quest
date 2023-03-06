
function sendPrompt(prompt, chaos, frequency_penalty) 
{
  try
  {
    // Get token details and baseUri from documentProperties, check to see if the URI needs to use old endpoint or not (depends on the API call and the region)
    var documentProperties = PropertiesService.getDocumentProperties();
    const token = documentProperties.getProperty("token")
    const baseUri = documentProperties.getProperty("baseURI")

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

function setAPICred()
{ 
    var documentProperties = PropertiesService.getDocumentProperties();
    documentProperties.setProperties({
      'token': "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",
      'baseURI': "https://api.openai.com/v1"
    }); 
}


function testTheThe()
{
  var response = "Great! Let's update the plot points and key characters based on the player's input and explore how to develop them:\n\nPlot Points:\n\n- Establishing the role and influence of The Voice: The Voice is a key character who serves as a guide to Consciousness. Talking to The Voice can help establish its knowledge and intentions towards helping Consciousness escape.\n\n- Understanding the nature of your inner demon: The distorted and ominous shadow in the mirror represents your inner demon. Talking to The Voice can provide insight on how to confront and defeat it.\n\n- Unlocking the door to the next room: The door in the room is locked, and the key provided to Consciousness may be the key to unlocking the door. Consciousness must find a way to unlock the door to progress to the next phase of the game.\n\nKey Characters:\n\n- The Voice: The Voice serves as the guide to Consciousness, and can provide insight and knowledge about the challenges and trials that Consciousness will face. The further the game progresses, the more the player and the character's trust could develop and the Voice's true nature can be revealed.\n\n- Inner Demon: The inner demon represents the darkest and most negative aspects of Consciousness. The Voice could be a helpful character in the development and the fight against the demon.\n\n- Room and the Door: The room and the locked door could be the representation of the Consciousness's mind and the next room the Consciousness the desire to the next stage of the journey.\n\nWays to Develop:\n\n- The player and the character can develop The Voice's character and the level of the relationship the the Voice and the character. The Voice could become the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the the "
if (response.includes("the the the"))
{
  var pos = response.indexOf("the the the")
  response = response.substring(0,pos+3)
  Logger.log(response)
}

}