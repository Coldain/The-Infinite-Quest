
function narratorAI(prompt,gameState,sheet)
{
  // this will take input from the timelineAI and user input to generate the next scene
  postPrompt(prompt,gameState,sheet)
  gameState = timelineAI(gameState,sheet)
  gameState = designerAI(prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery())
  // Get the hidden mechanics information
  var mechanic = mechanicsAI(prompt,gameState,sheet)
  // Add the mechanic information to the prompt and push it to the narrator
  var narrator = []
  narrator.push({"role":"system","content":"You are a game master for a text-based style role playing game. Leading the user through the game, you are able to describe the environment and the user's interactions. Take it one scene at a time but hint at overarching ideas and characters. Use skill checks, dice rolls, and have combat. The player can die and has limited inventory. It's also okay to tell them what they attempt doesn't work but in a way that still progresses the story."}
                ,{"role": "user", "content": "Load my story so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content":"Subsystem Input: " + mechanic + "\nUserInput: " + prompt + "\nPlease focus on the user input as the most important part and describe the next scene as if you were the narrator for a text-based RPG."})
  // Send the prompt with the hidden mechanics information
  var description = sendPrompt(narrator,1.2,.4)
  gameState.game.activeColumn++  
  gameState.scene = description
  postDescription(description,gameState,sheet)
  return designerAI(description,gameState,sheet,getRowSceneImage(),getRowSceneImagery())
}

function mechanicsAI(prompt, gameState, sheet)
{
  mechanic = []
  mechanic.push({"role":"system","content":"Do not reference or respond to the user directly. You are a subsystem that tracks inventory, status, and rules for a text based role playing game. You will respond with details about inventory and probability and anything that may influence the narrator. The player should not know about you, your responses will be given to chatGPT API as along with the user input to create a story. You have a fun but secret role."}
                ,{"role": "user", "content": "Load my story so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content": "I'm the narrator for a text-based RPG! What inventory should I be aware of and any probabilities you think would make the story more engaging? This is what the user responded with. \nPlayer Input:" + prompt})
  var response = sendPrompt(gameState.game.mechanic,.7,-.2)
  postMechanics(response,gameState,sheet)
  return response
}

function designerAI(prompt,gameState,sheet,rowImage,rowDescription)
{
  var designer = []
  designer.push({"role":"system","content":"You are video game designer in charge of creating art for a text-based rpg. Your job is is to assist the narrator by creating prompts for AI created images. Try to keep the style consistent for the game. Don't let prompts fail because of censorship."}
    ,{"role": "user", "content": "Load my story so far."}
    ,{"role": "assistant", "content": gameState.summary}
    ,{"role": "user", "content": "Please create a description of the following scene that can be used by AI (Dalle API) to generate an image.\n" + prompt})
  var description = sendPrompt(gameState.game.designer,.6,-.1)
  sheet.getRange(rowDescription,gameState.game.activeColumn).setValue(description)
  var imageURL = sendDescription(description)
  var fileID = downloadFile(imageURL)
  var inlineURL = "https://drive.google.com/uc?export=download&id="+fileID
  gameState.game.image.push("inlineURL")
  sheet.getRange(rowImage,gameState.game.activeColumn).setValue('=IMAGE("'+inlineURL+'")')
  return gameState
}

function assistAI(gameState,sheet)
{
  const assistant = []
  assistant.push({"role":"system","content":"You are an assistant bot for a text-based RPG narrator. Your job is to take a conversation thread from the narrator and user to provide some possible ideas. Don't give too much detail on what will happen. Lean into the narrative story and setting."}
                  ,{"role": "user", "content": "Load my story so far."}
                  ,{"role": "assistant", "content": gameState.game.summary}
                  ,{"role": "user", "content": "Remember the conversation history is from a different chat. I'm asking you for suggestions on what I can do next. Maybe 2 somewhat obvious and 2 really creative options Have the options be related to the character, story and scene."})
  var suggestion = sendPrompt(assistant,1.2,.4)
  postSuggestion(suggestion,gameState,sheet)
}

function timelineAI(gameState,sheet)
{
  // Check gameState story length, if it's 5 or more, send story off for a summary
  if (gameState.story.length >= 5)
  {
    const timeline = []
    timeline.push({"role":"system","content":"You are the timeline bot. Your job is to track and summarize the story so far. You will be used to generate the timeline that the other bots will use to craft the next scene."}
                  ,{"role": "user", "content": "Please load in my story so far."})
    timeline.push(gameState.story,{"role": "user", "content": "Please provide a short summary of my story so far. Capturing the world, characters, and plot."})
    // Replace gameState.story with the summary as an array with one element
    gameState.story = [sendPrompt(timeline,1.2,.4)]
  }
  const timeline = []
  timeline.push({"role":"system","content":"You are the timeline bot. Your job is to track and summarize the story so far. You will be used to generate the timeline that the other bots will use to craft the next scene."}
                ,{"role": "user", "content": "Please load in my story so far."})
  timeline.push(gameState.story,{"role": "user", "content": "Please provide a short summary of my story so far. Capturing the world, characters, and plot."})
  gameState.summary = sendPrompt(gameState.timeline,1.2,.4)
  timeline.push({"role": "assistant", "content": gameState.summary})
  // set the gameState.story equal to the timeline array minus the first two elements
  gameState.story = timeline.slice(2)
  postGameState(gameState,sheet)
  postSummary(gameState.summary,gameState,sheet)
  return gameState
}