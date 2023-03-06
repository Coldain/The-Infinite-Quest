function mechanicsAI(prompt, gameState, sheet)
{
  postPrompt(prompt,gameState,sheet)
  gameState = designerAI(prompt,gameState,sheet,4)
  gameState.game.activeColumn++  
  gameState.game.mechanic.push({"role": "user", "content": "I'm the narrator for a text-based RPG! What inventory should I be aware of and any probabilities you think would make the story more engaging? This is what the user responded with. \nPlayer Input:" + prompt})
  var mechanic = sendPrompt(gameState.game.mechanic,.7,-.2)
  gameState.game.mechanic.push({"role": "assistant", "content": mechanic})
  const narrator = JSON.parse(JSON.stringify(gameState.game.narrator))
  narrator.push({"role": "user", "content": + "\nSubsystem Input: " + mechanic + "\nUserInput: " + prompt + "\nPlease focus on the user input as the most important part."})
  gameState.game.narrator.push({"role": "user", "content": prompt})
  // Send the prompt with the hidden mechanics information
  var description = sendPrompt(narrator,1.2,.4)
  gameState.game.narrator.push({"role": "assistant", "content": description})
  postGameState(gameState,sheet)
  postDescription(description,gameState,sheet)
  return designerAI(description,gameState,sheet,2)

}


function designerAI(prompt,gameState,sheet,row)
{
  gameState.game.designer.push({"role": "user", "content": "Please create a prompt that can be used by AI (Dalle API) to generate an image for this scene.\n" + prompt})
  var description = sendPrompt(gameState.game.designer,.6,-.1)
  gameState.game.designer.push({"role": "assistant", "content": description})
  postGameState(gameState,sheet)
  var imageURL = sendDescription(description)
  var fileID = downloadFile(imageURL)
  var inlineURL = "https://drive.google.com/uc?export=download&id="+fileID
  gameState.game.image.push("inlineURL")
  sheet.getRange(row,gameState.game.activeColumn).setValue('=IMAGE("'+inlineURL+'")')
  return gameState
}

function assistAI(gameState,sheet)
{
  const assistant = JSON.parse(JSON.stringify(gameState.game.narrator))
  assistant.push({"role": "user", "content": "Remember the converstation history is from a different chat. I'm asking you for suggestions on what I can do next. Maybe 2 somewhat obvious and 2 really creative options Have the options be related to the character, story and scene."})
  Logger.log(assistant)
  assistant[0] = {"role": "system", "content": "You are an assistant bot for a text-based RPG narrator. Your job is to take a conversation thread from the narrator and user to provide some possible ideas. Don't give too much detail on what will happen. Lean into the narrative story and setting."}
  Logger.log(assistant)
  var suggestion = sendPrompt(assistant,1.2,.4)
  postSuggestion(suggestion,gameState,sheet)
}

function timelineAI(gameState,sheet)
{
  // this will summarize the story up until this point
  // It will hold 5 summaries before summarizing those together
  // This will feed into assist, mechanics, narrator, and maybe designer
  // 
}