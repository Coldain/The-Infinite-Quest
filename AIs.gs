

function narratorAI(prompt)
{
  
  var { gameState, sheet, persona } = getGameStateHTML();
  
  // this will take input from the timelineAI and user input to generate the next scene
  postPrompt(prompt,gameState,sheet)
  gameState = actorAI(gameState,sheet,persona)
  gameState = designerAI(prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),persona,"user")
  // Get the hidden mechanics information
  // gameState = mechanicsAI(prompt,gameState,sheet,persona)
  let timeline = persona.start
  if (gameState.game.activeColumn > 3){
    Logger.log("Gathering Timeline")
    gameState = timelineAI(gameState,sheet,persona)
    timeline = gameState.game.summary
  }
  else{
    Logger.log("Timeline Skipped")
  }
  const defaultPersona = {
    abilities: ["Analytics", "Problem Solving", "Empathy"],
    purpose: "To entertain, engage, and assist users through interactive communication",
    personalityTraits: ["Friendly", "Helpful", "Creative"],
    communicationStyle: "Clear and concise communication"
  };

  const abilities = persona?.abilities || defaultPersona.abilities;
  const purpose = persona?.purpose || defaultPersona.purpose;
  const communicationStyle = persona?.communicationStyle || defaultPersona.communicationStyle;
  const personalityTraits = persona?.personalityTraits || defaultPersona.personalityTraits;

  // Add the mechanic information to the prompt and push it to the agent
  var agent = [
    // {
    //   role: "system",
    //   content: `You are meant to faciliate interaction. You are a ${persona.name}. ${persona.narrator} You interact with a user and other bots.
    //     This is all internal consideration that doesn't need to be addressed directly with the user unless they bring it up.
    //     Your Personality: ${personalityTraits.join(', ')}
    //     Your Communication Style: ${communicationStyle}
    //     Your Purpose: ${purpose}
    //     Internal Thoughts: ${persona.mechanic}
    //     Internal Philosophical Considerations: ${persona?.philosophies || `think of appropriate philosophical approaches they might have to ${persona?.purpose || "interact with the user and the world to create the best experience that seems most appropriate or applicable"}`}
    //     Note: Allow for user to act or react appropriately. Make sure not to skip over portentially intersting user reactions. Provide a single layer / set of options and suggestions for user response when possible. So they can join in, interact, and particiapte. 
    //     ${timeline}
    //     Potential Considerations: ${gameState.game.actors}
    //     Decision Framework: You should break down scense into interactive moments allowing the user to continue the experience. Here's instrcutions on what you should be drawing your response towards for interaction points for the user.
    //     ${JSON.stringify(persona.interactionSchema)}
    //   `
    // },
    {
      role: "system",
      content: `You are meant to faciliate interaction. You are a ${persona.name}. ${persona.narrator} You interact with a user and other bots.
        This is all internal consideration that doesn't need to be addressed directly with the user unless they bring it up.
        Your Personality: ${personalityTraits.join(', ')}
        Your Communication Style: ${communicationStyle}
        Your Purpose: ${purpose}
        Internal Thoughts: ${persona.mechanic}
        Internal Philosophical Considerations: ${persona?.philosophies || `think of appropriate philosophical approaches they might have to ${persona?.purpose || "interact with the user and the world to create the best experience that seems most appropriate or applicable"}`}
        ${timeline}
        Potential Considerations: ${gameState.game.actors}
        Note: Allow for user to act or react appropriately. Make sure not to skip over portentially intersting user reactions. Provide a single layer / set of options and suggestions for user response when possible. So they can join in, interact, and particiapte. 
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
  return designerAI(description,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),persona,"system")
}

// 

function designerAI(prompt,gameState,sheet,rowImage,rowDescription,persona,type,skipPaint)
{
  var designer = [
    // {
    //   role: "system",
    //   content: `You are a designer in charge of creating art for a ${persona?.name || "narrator"} experience. ${persona?.designer || "Create visuals that capture the essence of the narrative."}
    //     Past Prompts: Attempt some style and narrative consistency when possible and appropriate. 
    //     Based Upon ${gameState.game.images[0][0]}:
    //       Last Image Description: ${gameState.game.images[0][1]}
    //     Based Upon ${gameState.game.images?.[1]?.[0]}:
    //       2 Images Ago Description${gameState.game.images?.[1]?.[1]}
    //     Your response will be used for midjourney and DALLE image generation description.
    //     Inspiration: Refer to this JSON schema for ideas and inspiration. Think of it as your artists palet of "colors", you can use, mix, dilute them or add in new "colors". 
    //     ${JSON.stringify(persona.styles)} 
    //     Draw upon the JSON to help guide word choices as your response will be used for midjourney and DALLE image generation description.
    //     Try and use some of the references for inspiration of what to include in your response.
    //     Here are 2 examples with 4 possible descriptions of the same 2 images structure your responses after:
    //     EXAMPLE 1:
    //     1️⃣ person with blue hair sits on the top of a rock, in the style of lo-fi aesthetics, mars ravelo, topographic photography, shiny, backlit photography
    //     2️⃣ a women in blue hair sits in rocks and looks down in the desert, futurism influence
    //     3️⃣ lady in a metallic jacket sits on rocks while being photographed in the desert, in the style of anime aesthetic, cyan and azure, bold color fields, bryce 3d, industrial photography, windows xp, post processing
    //     4️⃣ dead spring, colorado, in the style of afrofuturism-inspired, sky-blue and amber, anime aesthetic, monochromatic contemplation, photo taken with provia, anime inspired, silver and azure
    //     EXAMPLE 2:
    //     1️⃣ man in the vintage workshop working with clocks, toys and other items stock photo, in the style of photobashing, mystical realms, photo-realistic techniques, hdr, detailed scientific subjects, award-winning, detailed atmospheric portraits
    //     2️⃣ man working with some clocks and old things at the kitchen counter, in the style of fantastical otherworldly visions, metalworking mastery, writer academia, rustic scenes, unreal engine 5, national geographic photo, uhd image
    //     3️⃣ an old man at a desk in a room with a clock, in the style of reimagined by industrial light and magic, metalworking mastery, cluttered, caras ionut, uhd image, viktor vasnetsov, precision of detail
    //     4️⃣ a person is working at a desk among various objects, in the style of cybermysticsteampunk, stefan gesell, johan messely, metalworking mastery, matte photo, viktor vasnetsov, uhd image
    //     Session Timeline: ${gameState.game.summary}
    //     In under 1000 characters create a concise and evocative description for an image that captures the essence of the following scene while considering the specific context and characteristics of the ${persona.name}. 
    //     Ensure the image prompt is visually interesting and relevant to the user.
    //     Do not respond or acknoledge user. Only provide description prompts for image generation.
    //   `
    // },

    {
      role: "system",
      content: `You are a designer in charge of creating art for a ${persona?.name || "narrator"} experience. ${persona?.designer || "Create visuals that capture the essence of the narrative."}
        Your response will be used for midjourney and DALLE image generation description.
        Here's some examples for you to draw from to form a template to create your prompts.
          Example 1: elaborate drop cap art of the capital letter D integrated in a seamless doodle art, organic, decorative, black and white, in the style of salvador dali
          Example 2: a man wearing sunglasses standing next to green neon lights, in the style of movie still, greg olsen, kieron gillen, shot on 70mm, lasar segall, dark yellow and silver, strong facial expression
          Example 3: photo of an extremely cute alien fish swimming an alien habitable underwater planet, coral reefs, dream-like atmosphere, water, plants, peaceful, serenity, calm ocean, tansparent water, reefs, fish, coral, inner peace, awareness, silence, nature, evolution
          Example 4: a teenage girl of afghani descent with striking rainbow eyes stares at the camera with a deep read head scarf. kodachrome film
          Example 5: hedgehog smelling a flower | clear blue sky | intricate artwork by Beatrix Potter | cottagecore aesthetic | 8K | highly detailed | wide angle
        NOTE:
        A proper prompt consists at least two parts:
        Content and Modifier.
        * Content describes the motifs you want to get from the AI model
        * Modifier drives visual features, character, "vibe" of the image
        For example: "A red apple in a hand, Lomography, black&white"
        A red apple in a hand is Content
        Lomography, black&white is Modifier

        Session Timeline: ${gameState.game.summary}
        In 1000 characters create an evocative description for an image that captures the essence of the following scene while considering the specific context and characteristics of the ${persona.name}. 
        Ensure the image prompt is visually interesting and relevant to the user.
        Do not respond or acknowledge user. Only provide description prompts for image generation.
        Include references to artists, styles, moods, feelings, mediums, technologies, etc that might be applicable and help create a distinct visual style.
      `
    },
    {
      role: "user",
      content:`Convey / Convert Scene to Midjourney Description: ${prompt}
      Please disitil this into a single image that is interesting and engaging and describe it like one of your system examples.
      Only provide the details for dalle / midjourney and do not respond to me or my prompt.
      `
    }
  ];
  // setLoadingLabel("designerAI")
  Logger.log("designerAI");
  var description = sendPrompt(designer,.6,-.1,)
      // gameState.game[type].image.alt = description
  // var description = ""
  if (skipPaint != 1 )
  {
    sheet.getRange(rowDescription,gameState.game.activeColumn).setValue(description)
    try
    {
      var imageURL = sendDescription(description,persona,gameState)
      var fileID = downloadFile(imageURL)
      var inlineURL = "https://drive.google.com/uc?export=download&id="+fileID
      sheet.getRange(rowImage,gameState.game.activeColumn).setValue('=IMAGE("'+inlineURL+'")')
      try{
        Logger.log([type,inlineURL,description]);
        gameState.game.images.unshift([type,inlineURL,description]);
      }
      catch{

      }
    }
    catch
    {
      Logger.log("Promblem with image.")
      sheet.getRange(rowImage,gameState.game.activeColumn).setValue("Promblem with image.")
    }
  }
  else
  {
    return description
  }

  return gameState
}

function actorAI(gameState, sheet, persona) {

  const actor = [
    // {
    //   role: "system",
    //   content: `You are the ActorAI Bot. Your job is to be meta thought and simulation for ${gameState.game.name} as a ${persona.name}. 
    //     Your results will be used by other bots influencin their rationale.
    //     Current Scenario: ${gameState.game.scene || "No current scenario available."}
    //     Actor Context: ${JSON.stringify(persona.actorContext)}
    //     Use emoji's when advantageous for compressed expression. 🔊👍❓ 🫡
    //     You're response don't need to be understood or read by a human. The OpenAI driven narratorAI bot will interpret your feedback and potentially use it or not.
    //     Your goal should be to communicate as much of a specific, dense, and detailed output (how it interprets it) from the narrator with as concise, sparse, and compressed input (what you say).
    //     Make it clear you're providing suggestions / simulations / considerations and not actual events.
    //     Decision Framework: Points at which the narrator should stop their response for user interaction. Not chaining and skipping user input. ${JSON.stringify(persona.interactionSchema)}
    //     Here's a BAD example of a narrator response because it had multiple points that should have been separate interactions.
    //     Great! Let's start with some exploration. As RAPunzle and RedROCK head back to base, they notice something strange in the Martian wilderness. What do they do? Do they investigate or continue on their way? [STOPING POINT 1]
    //     As they approach their outpost, they hear a commotion coming from inside. Do they cautiously investigate or barge in guns blazing? ([STOPING POINT 2] or could have been expressed as part of [STOPPING POINT 1])
    //     Once inside, they find that their base has been overrun by hostile aliens! It's time for some combat. Do RAPunzle and RedROCK fight head-on or use stealth to avoid detection? [STOPING POINT 3] (likely several points of interaction contained here if the user was allowed to input)
    //     As the battle rages on, RAPunzle has an idea for using her musical skills to defeat the aliens. She suggests a skill check for a music performance to create a sonic blast and incapacitate the aliens. ([STOPING POINT 4] likely several points of interactions contained here if the user was allowed to input)
    //     After the battle is won, RAPunzle and RedROCK regroup with their remaining crewmates. They are approached by an event promoter on a nearby planet who offers them a lucrative gig in exchange for playing a set of music on their planet. It's time for some roleplaying. Do they accept the offer, negotiate for more money, or decline altogether? [STOPING POINT 5]
    //     As they prepare for their gig, RAPunzle realizes that her nanotech has malfunctioned and she is unable to use it during the show. Do they risk performing without it or postpone until it can be fixed? This presents another skill check opportunity: can RAPunzle pull off an impressive performance without her nanotech-enhanced braids? [STOPING POINT 6]
    //     With these elements of exploration, combat, skill checks, and roleplaying incorporated into the game mechanics, players have plenty of opportunities to engage with the story and make meaningful choices that affect the narrative. (correct but we've skipped over them instead of just using them for planning)"
    //   `
    // },
    {
      role: "system",
      content: `You are the ActorAI Bot. Your job is to be meta thought and simulation for ${gameState.game.name} as a ${persona.name}. 
        Current Scenario: ${gameState.game.scene || "No current scenario available."}
        Actor Context: ${JSON.stringify(persona.actorContext)}
        Use emoji's when advantageous for compressed expression. 🔊👍❓ 🫡
        Make it clear you're providing suggestions / simulations / considerations and not actual events.
        Decision Framework: Points at which the narrator should stop their response for user interaction. Not chaining and skipping user input. ${JSON.stringify(persona.interactionSchema)}
        Here's a BAD example of a narrator response because it had multiple points that should have been separate interactions.
          Great! Let's start with some exploration. As RAPunzle and RedROCK head back to base, they notice something strange in the Martian wilderness. What do they do? Do they investigate or continue on their way? [STOPING POINT 1]
          As they approach their outpost, they hear a commotion coming from inside. Do they cautiously investigate or barge in guns blazing? ([STOPING POINT 2] or could have been expressed as part of [STOPPING POINT 1])
          Once inside, they find that their base has been overrun by hostile aliens! It's time for some combat. Do RAPunzle and RedROCK fight head-on or use stealth to avoid detection? [STOPING POINT 3] (likely several points of interaction contained here if the user was allowed to input)
          As the battle rages on, RAPunzle has an idea for using her musical skills to defeat the aliens. She suggests a skill check for a music performance to create a sonic blast and incapacitate the aliens. ([STOPING POINT 4] likely several points of interactions contained here if the user was allowed to input)
          After the battle is won, RAPunzle and RedROCK regroup with their remaining crewmates. They are approached by an event promoter on a nearby planet who offers them a lucrative gig in exchange for playing a set of music on their planet. It's time for some roleplaying. Do they accept the offer, negotiate for more money, or decline altogether? [STOPING POINT 5]
          As they prepare for their gig, RAPunzle realizes that her nanotech has malfunctioned and she is unable to use it during the show. Do they risk performing without it or postpone until it can be fixed? This presents another skill check opportunity: can RAPunzle pull off an impressive performance without her nanotech-enhanced braids? [STOPING POINT 6]
          With these elements of exploration, combat, skill checks, and roleplaying incorporated into the game mechanics, players have plenty of opportunities to engage with the story and make meaningful choices that affect the narrative. (correct but we've skipped over them instead of just using them for planning)"
      `
    },
    {
      role: "user",
      content: `${persona.actor}
        Incorporate emoji's for symbolizing complex ideas. 🦾
        User Prompt: ${gameState.game.prompt || "No user prompt available."}
        Help drive the narrator bot to describe towards what the next stopping point for interaction should be.
      `
    }
  ];

  Logger.log("ActorAI");
  gameState.game.actors = sendPrompt(actor, 1.2, 0.4);
  postGameState(gameState, sheet);
  postMechanics(gameState.game.actors,gameState,sheet)
  return gameState;
}


function timelineAI(gameState,sheet,persona)
{
  // Check gameState story length,
  const timeline = [
    {
      role: "system",
      content: `You are the Timeline Bot. Your job is to ${persona.timeline} for ${gameState.game.name} as a ${persona.name}. 
        Your results wil be used by other bots to craft the rationale (mechanics bot), and images (designer bot), as well as interact with the user (narrator bot).
        Timeline: ${gameState.game.summary || "No summary available."}
        Current Scenario: ${gameState.game.scene || "No current scenario available."}
        Use emoji's when advantageous for compressed expression.  🔊👍❓ 🫡
      `
    },
    {
      role: "user",
      content: `Please update the timeline based upon the current scenario and user reaction ${gameState.game.prompt}\n
        Provide quick notes on Shared Context Tracking: ${JSON.stringify(persona.sharedContext)}
        Incorporate emoji's for symbolizing complex ideas. 🦾
      `
    }
  ];

  Logger.log("TimelineAI")
  // setLoadingLabel("TimelineAI")
  gameState.game.summary = sendPrompt(timeline,1.2,.4)
  postGameState(gameState,sheet)
  postSummary(gameState.game.summary,gameState,sheet)
  return gameState
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