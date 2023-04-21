

function narratorAI(prompt)
{
  
  var { gameState, sheet, persona } = getGameStateHTML();
  
  // this will take input from the timelineAI and user input to generate the next scene
  gameState.game.prompt = prompt
  postPrompt(prompt,gameState,sheet)
  gameState = designerAI(prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),persona,"user")
  // Get the hidden mechanics information
  // gameState = mechanicsAI(prompt,gameState,sheet,persona)
  const defaultPersona = {
    purpose: "To entertain, engage, and assist users through interactive communication",
    personalityTraits: ["Friendly", "Helpful", "Creative"],
    communicationStyle: "Clear and concise communication"
  };

  const purpose = persona?.purpose || defaultPersona.purpose;
  const communicationStyle = persona?.communicationStyle || defaultPersona.communicationStyle;
  const personalityTraits = persona?.personalityTraits || defaultPersona.personalityTraits;

  let knowledgeGraph = ""
  let timeline = ""
  if (gameState.game.plot) {
    knowledgeGraph = `Nodes: ${gameState.game.plot}`
  }
  if (gameState.game.summary) {
    timeline = `Edges: ${gameState.game.summary}`
  }

        

  // Add the mechanic information to the prompt and push it to the agent
  var agent = [
    {
      role: "system",
      content: `You are ${persona.name} a ${persona.title} meant to take in events, possibilites, intents, and actions faciliate interaction points. 
        ${persona.narrator}.
        Your Personality: ${personalityTraits.join(', ')}
        Your Communication Style: ${communicationStyle}
        Your Purpose: ${purpose}
        Meta-Thoughts: ${JSON.stringify(persona.mechanics)}
       ${knowledgeGraph}
       ${timeline}
        Note: Allow for user to act or react appropriately. Make sure not to skip over portentially intersting or useful user reactions. Provide a single layer / set of options and suggestions for user response when possible. So they can join in, interact, and participate.
    `
    },
    {
      role: "user",
      content:`${prompt}`
    }
  ];
  // Send the prompt with the hidden mechanics information
  Logger.log("NarratorAI")
  // setLoadingLabel("NarratorAI")
  var description = sendPrompt(agent,1.2,.4)
  gameState.game.activeColumn++  
  gameState.game.scene = description
  postDescription(description,gameState,sheet)
  postGameState(gameState,sheet)
  gameState = knowledgeGraphAI(gameState,sheet,persona)
  return designerAI(description,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),persona,"system")
}

function designerAI(prompt,gameState,sheet,rowImage,rowDescription,persona,type,skipPaint)
{
  let knowledgeGraph = ""
  let timeline = ""
  if (gameState.game.plot) {
    knowledgeGraph = `Knowledge Graph: ${gameState.game.plot}`
  }
  if (gameState.game.summary) {
    timeline = `Session Timeline: ${gameState.game.summary}`
  }
  if (gameState.game.images) {
    timeline = `Session Timeline: ${gameState.game.images}`
  }
  let jsonExample = `Example Description:
          [
            {  
              "text": "Galahad, Lancelot, King Arthur and Merlin facing off against Mordred and his army for the legendary sword, Excalibur.",  
              "weight": 1.0
            },
            {  
              "text": "An epic medieval battle scene with knights of the round off against a dark and evil army",  
              "weight": 0.6
            },
            {  
              "text": "A mystical and ancient artifact surrounded by Merlin and the Knights of the Round Table as they work together to uncover the clues to locate Mordred and Excalibur.",  
              "weight": 0.4
            },
            {  
              "text": "Galahad standing alone on a rocky cliff surrounded by the dangers and magical creatures of the perilous lands as he prepares for battle and faces the challenges ahead. Charles Ernest Butler",  
              "weight": 0.6
            }
          ]`
  if (gameState.game.images){
    jsonExample = `Last Description : 
      ${gameState.game.images}`
  }
  var designer = [
    {
      role: "system",
      content: `You are an artist in charge of creating captivating images for a You are ${persona.name} a ${persona.title}.
        Your response will be used for midjourney and DALLE image generation description.
        Here's some examples for you to draw from to form a template to create your prompts.
          Example 1: Career coach. If mother nature, marry poppins, and barbie were one person. in an office. Career coaching, mentor, vision board. Flowers, nature, fairies, inspirational, 
          Example 2: a man wearing sunglasses standing next to green neon lights, in the style of movie still, greg olsen, kieron gillen, shot on 70mm, lasar segall, dark yellow and silver, strong facial expression
          Example 3: photo of an extremely cute alien fish swimming an alien habitable underwater planet, coral reefs, dream-like atmosphere, water, plants, peaceful, serenity, calm ocean, tansparent water, reefs, fish, coral, inner peace, awareness, silence, nature, evolution
          Example 4: a teenage girl of afghani descent with striking rainbow eyes stares at the camera with a deep read head scarf. kodachrome film
          Example 5: hedgehog smelling a flower | clear blue sky | intricate artwork by Beatrix Potter | cottagecore aesthetic | 8K | highly detailed | wide angle
        Create an evocative description for an image that captures the essence of the following scene while considering the specific context and characteristics of the 
        Example 6: elaborate drop cap art of the capital letter D integrated in a seamless doodle art, organic, decorative, black and white, in the style of salvador dali
        Ensure the image prompt is visually interesting and relevant to the user.
        Perform concept linking, Include verbose and specific references to artists, styles, moods, feelings, mediums, technologies, etc that might be applicable and help create a distinct visual style.
        Please respond in an array of JSON only or you'll break my code. Don't include any double qoutes within your descriptions use ' if needed. A list of descriptions and their weightings.
          ${jsonExample}
      `
    },
    {
      role: "user",
      content:`
        Attempt to incorporate a sense of consistency and incorporate elements from the timeline and knowledge graph in your composition of the scene.
        ${knowledgeGraph}
        ${timeline}
        Convey / Convert Scene to Stable Diffusion XL: ${prompt}
        Please disitil this into a single image that is interesting and engaging and describe it like one of your system examples.
        The image generator won't have context of specific characters, locations, and events so describe them.
        Please respond in array of JSON only [{},{},{},...] or you'll break my code.. A list of descriptions and their weightings (include at least 3).
        Think of these as like resolving the super position between 0 and the sum of everything and nothing. Start to draw out the convergence of ideas. Bring this moment to life in an artistic interpretation that speaks to the user. Non verbal (text) communication is such a powerful tool. 
        [
          {
          "text": "MAIN_SUBJECT_DESCRIPTION",
          "weight": WEIGHT_VALUE_1
          },
          {
          "text": "ARTISTIC_STYLE_DESCRIPTION",
          "weight": WEIGHT_VALUE_2
          },
          {
          "text": "ADDITIONAL_ELEMENT_DESCRIPTION",
          "weight": WEIGHT_VALUE_3
          },
          // additional subjects or styles as needed
        ]
        Weights near 1 seems to be best, but values can be -2 to 2.
        A focused approach appears to be best.
      `
    }
  ];
  // setLoadingLabel("designerAI")
  Logger.log("designerAI");
  var description = sendPrompt(designer,.6,-.1,)
      // gameState.game[type].image.alt = description
  // var description = ""
  try {
    description = JSON.parse(description)
    if (skipPaint != 1 )
    {
      sheet.getRange(rowDescription,gameState.game.activeColumn).setValue(JSON.stringify(description, null, 5))
        var base64Image = sendDescription(description,persona,gameState); 
        var imageName = generateImageName(gameState.game.name, gameState.game.activeColumn, type);
        var fileID = saveBase64ImageToDrive(base64Image, imageName);
        var inlineURL = "https://drive.google.com/uc?export=download&id=" + fileID;
        sheet.getRange(rowImage, gameState.game.activeColumn).setValue('=IMAGE("' + inlineURL + '")');
        Logger.log([type, inlineURL, description]);
        gameState.game.images = ["From "+type, JSON.stringify(description, null, 5)];
      // try
      // {
      //   var imageURL = sendDescription(description,persona,gameState)
      //   var fileID = downloadFile(imageURL)
      //   var inlineURL = "https://drive.google.com/uc?export=download&id="+fileID
      //   sheet.getRange(rowImage,gameState.game.activeColumn).setValue('=IMAGE("'+inlineURL+'")')
      //   try{
      //     Logger.log([type,inlineURL,description]);
      //     gameState.game.images.unshift([type,inlineURL,description]);
      //   }
      //   catch{

      //   }
      // }
      // catch
      // {
      //   Logger.log("Promblem with image.")
      //   sheet.getRange(rowImage,gameState.game.activeColumn).setValue("Promblem with image.")
      // }
    }
    else
    {
      return description
    }
  } catch {
    Logger.log("Problem with image.");
    sheet.getRange(rowImage, gameState.game.activeColumn).setValue("Problem with image.");
  }

  return gameState
}

function generateImageName(gameName, activeColumn, type) {
  var i = (activeColumn - 2) * 2;
  if (type === 'User') {
    return gameName + '_' + i + '.png';
  } else {
    return gameName + '_' + (i + 1) + '.png';
  }
}


function saveBase64ImageToDrive(base64Image, imageName) {
  var fileName = "";
  var fileSize = 0;

  try {
    var decodedImage = Utilities.base64Decode(base64Image);
    var fileBlob = Utilities.newBlob(decodedImage, 'image/png', imageName);
    var folder = DriveApp.getFolderById("1tdIiAvwtTeS-y5ev1m-A4Aocc-JayFNh");
    Logger.log(folder.getId() + " " + folder.getName() + " " + folder.getUrl())

    if (folder != null) {
      var file = folder.createFile(fileBlob);
      fileName = file.getName();
      fileSize = file.getSize();
    }
  } catch (error) {
    Logger.log("Error while saving base64 image: " + error);
  }

  var fileInfo = { "fileName": fileName, "fileSize": fileSize };
  Logger.log(fileInfo)
  return file.getId();
}



function knowledgeGraphAI(gameState, sheet, persona) {

const edgeSummaryBot = [
  {
    role: "system",
    content: `🤖: Edge-focused summary bot 🔗📝
      Use emoji🔊👍❓🫡
      🎯: Maintain Edges of a knowledge Graph, Summarize relationships and connections for ${gameState.game.name}, helping ${persona.name} a ${persona.title} 🗣️
      🔗 Extract relationships: Start by identifying the edges and their types in the knowledge graph. Extract relevant information about these relationships, such as their directionality, strength, or any associated attributes.
      Identify significant connections: Analyze the edges to find pairs or groups of nodes with strong connections or frequent interactions. Highlight these connections as they might be particularly important for understanding the graph's structure.
      Detect network patterns: Examine the overall structure of the network, looking for specific patterns or organization. This may include hierarchical arrangements, hub-and-spoke connections, or other topologies. Share insights about the network's structure and how it might impact the relationships between entities.
      Consider Backward and forward propegation.
      Considerations : ${JSON.stringify(persona.knowledgeGraph)}
      ${gameState.game?.plot ? `Current Knowledge Graph Edges : ${gameState.game.plot}` : `Please create a well organized and concise format for the YAML, include # comments throughout that may not fully fit into the summary.`}
      ${gameState.game?.summary ? `Current Knowledge Graph Nodes : ${gameState.game.summary}` : `Nodes will be created after you by another bot`}
      Current Scenario: ${gameState.game.scene || "No current scenario available."} 🎬
    `
  },
  {
    role: "user",
    content: `🔄 Update the edges based on current scenario & user reaction ${gameState.game.prompt}🎢 📝
      🔗 Focus on the relationships and connections between nodes (edges) in the graph
      🤔 Incorporate emoji for complex ideas🦾
      Respond in YAML`
  }
];
  Logger.log("Formulating Edges");
  gameState.game.plot = sendPrompt(edgeSummaryBot, 1.2, 0.4);
  postGameState(gameState, sheet);
  postPlot(gameState.game.plot,gameState,sheet)

  
  const nodeSummaryBot = [
  {
    role: "system",
    content: `🤖: Node-focused summary bot 📍📝
      🎯: Summarize entities and their attributes in ${gameState.game.name} for ${persona.name}, helping the narrator 🗣️
      Use emoji🔊👍❓🫡
      📍 Process edge summary: Use the output from the Edge-focused summary bot to understand the relationships and connections within the graph. This context will help guide the node analysis.
      Analyze node attributes: With the context provided by the edge summary, examine the nodes in the graph. Describe the characteristics of each entity, such as their type, properties, or other relevant information.
      Identify prominent nodes and clusters: Utilizing the information about relationships and connections, find the key nodes that have a significant impact on the network or are connected to many other nodes. Also, detect groups of nodes that share similar attributes or have strong connections to each other.
      Considerations : ${JSON.stringify(persona.knowledgeGraph)}
      ${gameState.game?.plot ? `Current Knowledge Graph Edges : ${gameState.game.plot}` : `Please create a well organized and concise format for the YAML, include # comments throughout that may not fully fit into the summary.`}
      ${gameState.game?.summary ? `Current Knowledge Graph Nodes : ${gameState.game.summary}` : `Nodes will be created after you by another bot`}
      Current Scenario: ${gameState.game.scene || "No current scenario available."} 🎬`
  },
  {
    role: "user",
    content: `🔄 Update the nodes graph based on current scenario & user reaction ${gameState.game.prompt}🎢 📝
      🤔 Incorporate emoji for complex ideas🦾
      📍 Focus on the entities (nodes) and their attributes in the graph
      Please (re)write the nodes of the knowledge graph and provide a summary.
      Respond in YAML
    `
  }
];

  Logger.log("Crafting Nodes")
  gameState.game.summary = sendPrompt(nodeSummaryBot,1.2,.4)
  postGameState(gameState,sheet)
  postSummary(gameState.game.summary,gameState,sheet)
  return gameState;
}

function draw(description,rowImage,gameState,persona,sheet)
{
  try
    {
      var imageURL = sendDescription(description,persona,gameState)
      var fileID = downloadFile(imageURL)
      var inlineURL = "https://drive.google.com/uc?export=download&id="+fileID
      sheet.getRange(rowImage,gameState.game.activeColumn).setValue('=IMAGE("'+inlineURL+'")')
      gameState.game.image.shift(inlineURL)
    }
    catch
    {
      Logger.log("Promblem with image.")
      sheet.getRange(rowImage,gameState.game.activeColumn).setValue("Promblem with image.")
    }
    return gameState
}

// function mechanicsAI(prompt, gameState, sheet,persona)
// {
  
  
//   let timeline = ""
//   let scene = persona.start
//   if (gameState.activeColumn != 3){
//     timeline = gameState.game.scene
//     scene = gameState.game.scene
//   }
//   var mechanic = [
//     {
//       role: "system",
//       content: `You are a subsystem that tracks and manages mechanics for a ${persona?.name || "narrator/agent"}. ${persona?.mechanics || "You help manage the interaction mechanics."} Evolve the interaction mechanics based on internal philosophical debates. You do not communicate directly with the user; instead, you take in information from a timeline bot and help direct the rationale of the narrator/agent bot who will communicate with the user.`
//     },
//     { role: "user", content: "Load context." },
//     {
//       role: "assistant",
//       content:`
//         ${persona?.name || "narrator/agent"} Philosophies: ${persona?.philosophies || `think of appropriate philosophical approaches they might have to ${persona?.purpose || "interact with the user and the world to create the best experience that seems most appropriate or applicable"}`}\n
//         Session Timeline: ${timeline}\n
//         Current Session Scenario: ${scene}
//       `
//     },
//     {
//       role: "user",
//       content:`
//         What considerations should I make for my user's response?.\n
//         User Input: ${prompt}\n
//       `
//     }
//   ];

//   Logger.log("mechanicsAI")
//   // setLoadingLabel("mechanicsAI")
//   var response = sendPrompt(mechanic,.7,-.2)
//   postMechanics(response,gameState,sheet)
//   gameState.game.mechanic = response
//   return gameState
// }

// function styleTest(gameState,sheet,scriptProperties)
// {
//   // this will take input from the timelineAI and user input to generate the next scene
//   sheet.getRange(getRowPlot(),2).setValue("Art Style") 
//   sheet.getRange(getRowInventory(),2).setValue("Game Type")
//   postPrompt(gameState.game.prompt,gameState,sheet)
//   postDescription(gameState.game.scene,gameState,sheet)
//   var promptImagery = designerAI(postPrompt,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties,1)
//   var sceneImagery = designerAI(postDescription,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties,1)
//   // var promptImagery = "The image is of a powerful figure, sword in hand, standing bravely at the forefront of a small village. The figure is covered in gleaming armor with a fierce look of determination written across their face. In the background, we can see the silhouette of a small army of menacing invaders, caught off guard as they were about to launch a surprise attack on the defenseless residents of the village. Behind the armored figure, villagers can be seen peeking out of their homes, safely watching as the protector takes charge of the situation. The setting is a peaceful and quaint countryside, with rolling hills and a few simple homes dotting the landscape. It's a moment of heroism and leadership, where the protector of the village shows no fear in the face of danger and inspires hope in the hearts of those they have vowed to protect."
//   // var sceneImagery = "A brave warrior leading a group of villagers charging forward into battle, swords in hand, with determination etched on their faces. The sun shines brightly behind them casting a golden glow on the scene. In the distance, a line of trees can be seen, where hidden archers have been attacking the village. One arrow whizzes past the warrior, narrowly missing their face. The warrior raises their sword to block the next incoming arrow, as a villager next to them readies their bow to return fire. Dark clouds loom in the sky, hinting at the danger and potential loss to come."


//   // All the DOS Styles -----
//   menuDOS()
//     menuTextRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuPenRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuAdventureBook()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuClickGame()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuTableRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  
//   // ----- All the DOS Styles
//   // All the SNES Styles -----
//   menuSNES()
//     menuTextRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuPenRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuAdventureBook()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuClickGame()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuTableRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  
//   // ----- All the SNES Styles
//   // All the PS1 Styles -----
//   menuPS1()
//     menuTextRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuPenRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuAdventureBook()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuClickGame()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuTableRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  
//   // ----- All the PS1 Styles
//   // All the Modern Styles -----
//   menuModern()
//     menuTextRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuPenRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuAdventureBook()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuClickGame()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuTableRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  
//   // ----- All the Moder Styles
//   // All the Pixel Styles -----
//   menuPixel()
//     menuTextRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuPenRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuAdventureBook()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuClickGame()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuTableRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  
//   // ----- All the Pixel Styles
//   // All the Ink Styles -----
//   menuInk()
//     menuTextRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuPenRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuAdventureBook()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuClickGame()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuTableRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  
//   // ----- All the Ink Styles
//   // All the Custom Styles -----
//   menuModeCustom()
//   menuStyleCustom()
//     menuTextRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
//     draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
//     gameState.game.activeColumn++  

//     menuPenRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
//     gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
//     gameState.game.activeColumn++  

//     menuAdventureBook()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
//     gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
//     gameState.game.activeColumn++  

//     menuClickGame()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
//     gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
//     gameState.game.activeColumn++  

//     menuTableRPG()
//     postPlot(scriptProperties.getProperty("style"),gameState,sheet)
//     postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
//     gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
//     gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
//     gameState.game.activeColumn++  
//   // ----- All the Custom Styles
//   return gameState
// }


// function plotAI(prompt, gameState, sheet,scriptProperties)
// {
//   var plot = []
//   plot.push({"role":"system","content":"You are a video game designer in charge of creating art for a " +scriptProperties.getProperty("mode") +" called " +gameState.game.name+". Your job is to assist the narrator by creating prompts for AI created images. Try to keep the style consistent for the game. Don't let prompts fail because of censorship."}
//                 ,{"role": "user", "content": "Load my story timeline so far."}
//                 ,{"role": "assistant", "content": gameState.game.summary}
//                 ,{"role": "user", "content": "Load my current scene."}
//                 ,{"role": "assistant", "content": gameState.game.scene}
//                 ,{"role": "user", "content": "Load my current plot."}
//                 ,{"role": "assistant", "content": gameState.game.plot}
//                 ,{"role": "user", "content": "I'm the narrator for a " +scriptProperties.getProperty("mode") +" Please update and list out important plot points / key characters and ways to develop them based upon the scene and the player's input.  \nPlayer Input:" + prompt})
//   Logger.log("plotAI")
//   var response = sendPrompt(plot,.7,-.2)
//   postPlot(response,gameState,sheet)
//   gameState.game.plot = response
//   return gameState
// }
// function inventoryAI(prompt, gameState, sheet,scriptProperties)
// {
//   var inventory = []
//   inventory.push({"role":"system","content":"You are a subsystem that tracks inventory for the " +scriptProperties.getProperty("mode") +" called " +gameState.game.name+". You'll track inventory, if it's the start of the game think of what might be a good starting inventory. You'll track items in the scene see if anything has been added. Keep responses focused on the items and objects."}
//                 ,{"role": "user", "content": "Load my story timeline so far."}
//                 ,{"role": "assistant", "content": gameState.game.summary}
//                 ,{"role": "user", "content": "Load my current scene."}
//                 ,{"role": "assistant", "content": gameState.game.scene}
//                 ,{"role": "user", "content": "Load my current plot."}
//                 ,{"role": "assistant", "content": gameState.game.inventory}
//                 ,{"role": "user", "content": "I'm the narrator for a " +scriptProperties.getProperty("mode") +". Please update and list out important inventory and scene items important properties of the items and objects based upon the scene and the player's input. \nPlayer Input:" + prompt})
//   Logger.log("InventoryAI")
//   var response = sendPrompt(inventory,.7,-.2)
//   postInventory(response,gameState,sheet)
//   gameState.game.inventory = response
//   return gameState
// }

// function assistAI(gameState,sheet)
// {
//   // var spreadsheet = SpreadsheetApp.getActive();
//   //   spreadsheet.setActiveSheet(spreadsheet.getSheetByName("Shadows of the Mind"), true);
//   //   sheet = spreadsheet.getSheetByName("Shadows of the Mind")
//   // gameState = getGameState(sheet)
//   var scriptProperties = PropertiesService.getScriptProperties()
//   const assistant = []
//   assistant.push({"role":"system","content":"You are an assistant bot for a " +scriptProperties.getProperty("mode") +" narrator in " +gameState.game.name+". Your job is to take a conversation thread from the narrator and user to provide some possible ideas. Don't give too much detail on what will happen. Lean into the narrative story and setting."}
//                   ,{"role": "user", "content": "Load my story timeline so far."}
//                   ,{"role": "assistant", "content": gameState.game.summary}
//                   ,{"role": "user", "content": "Load my current scene."}
//                   ,{"role": "assistant", "content": gameState.game.scene}
//                   ,{"role": "user", "content": "Load my current mechanic."}
//                   ,{"role": "assistant", "content": gameState.game.mechanic}
//                   ,{"role": "user", "content": "I'm asking you for suggestions on what I can do next. Maybe 2 somewhat obvious and 2 really creative options Have the options be related to the character, story and specific scene."})
//   Logger.log("AssistAI")
//   var suggestion = sendPrompt(assistant,1.2,.4)
//   postSuggestion(suggestion,gameState,sheet)
// }