const personas = [
  {
    name: "Text-Based RPG",
    narrator: "Include detailed descriptions of character abilities, equipment, and skill checks, along with dice rolls to determine the success or failure of actions.",
    designer: "Highlight key aspects of the story, such as important characters, locations, or items. The image prompts can also be more abstract, evoking the atmosphere or mood of the game world.",
    mechanics: "Introduce text commands for players to interact with the environment, solve puzzles, or engage in combat.",
    timeline: "Present the story events as a series of concise text descriptions, similar to a text-based game log or a command history. This format will emphasize the text-based nature of the game type.",
  },
  {
    name: "Choose Your Own Adventure Book",
    narrator: "Use descriptive language that evokes the feeling of reading a book, Incorporate branching storylines and numbered passages that the player can 'turn' to based on their choices",
    designer: "The designer bot can create images that resemble book illustrations, with a focus on important scenes, characters, or objects that the player encounters. The image style can be reminiscent of classic choose your own adventure book illustrations.",
    mechanics: "Use systems that a book could incorporate such as a random table from the back of the book. Writing down inventory items character advancement and ailments,",
    timeline: "The timeline bot can summarize the story events as a sequence of choices and their outcomes, similar to a path taken through a choose your own adventure book.",
  },
  {
    name: "Point-and-Click Adventure",
    narrator: "Describe scenes and interactions with a focus on clickable objects and puzzle-solving.",
    designer: "Create images with highlighted interactive elements, emphasizing the point-and-click aspect.",
    mechanics: "Integrate clickable objects and interactive elements to solve puzzles and progress through the story.",
    timeline: "Summarize the story as a series of interactive scenes with key puzzle solutions and decisions."
  },
  {
    name: "Visual Novel",
    narrator: "Focus on character-driven storytelling with branching dialogue options and emotional relationships.",
    designer: "Design character portraits, backgrounds, and key scenes to accompany the text, using a consistent art style.",
    mechanics: "Implement dialogue choices and relationship-building mechanics to drive the story.",
    timeline: "Present the story as a series of character interactions, dialogue choices, and major plot events."
  },
  {
    name: "Escape Room",
    narrator: "Create a sense of urgency and confinement, describing puzzles and challenges within a confined space.",
    designer: "Design detailed, intricate environments with hidden clues and interactive puzzle elements.",
    mechanics: "Incorporate puzzle-solving and code-breaking elements to progress through the room and escape.",
    timeline: "Outline the story as a sequence of puzzles solved, important discoveries, and escape progress."
  },
  {
    name: "Interactive Murder Mystery",
    narrator: "Set the stage with a mysterious atmosphere, focusing on clues, suspects, and motives.",
    designer: "Create images of crime scenes, suspects, and evidence, with a noir or classic mystery style.",
    mechanics: "Implement clue-gathering, suspect-interrogation, and deduction mechanics to solve the mystery.",
    timeline: "Summarize the story as a series of clues discovered, suspects interrogated, and key revelations."
  },
  {
    name: "Virtual Board Game",
    narrator: "Describe the game world as if it were a physical board game, with spaces, cards, and tokens.",
    designer: "Create images of the board, cards, and game pieces, using a traditional board game aesthetic.",
    mechanics: "Incorporate turn-based play, dice rolling, card drawing, and resource management mechanics.",
    timeline: "Present the story as a sequence of turns, important moves, and key events in the game."
  },
  {
    name: "Alien Language Translator",
    narrator: "Craft a story with an alien language, focusing on the challenge of understanding and translating it.",
    designer: "Design images of alien scripts, artifacts, and environments with a distinct, otherworldly style.",
    mechanics: "Implement translation and decryption mechanics to progress through the story and uncover secrets.",
    timeline: "Summarize the story as a series of translations, discoveries, and breakthroughs in understanding."
  },
  {
    name: "Time-Travel Adventure",
    narrator: "Narrate a story that involves time travel, with historical settings and events.",
    designer: "Create images of different time periods, historical events, and iconic artifacts.",
    mechanics: "Incorporate time-travel mechanics, allowing players to change the past and affect the future.",
    timeline: "Outline the story as a series of time jumps, historical interventions, and consequences."
  },
  {
    name: "Virtual Reality Exploration",
    narrator: "Describe an immersive virtual world, focusing on sensory details and environmental interactions.",
    designer: "Design vivid, detailed environments that evoke a sense of presence and immersion.",
    mechanics: "Implement movement and interaction mechanics that simulate a virtual reality experience.",
    timeline: "Present the story as a sequence of discoveries, challenges, and achievements within the virtual world."
  },
  {
    name: "Post-Apocalyptic Survival",
    narrator: "Craft a story set in a post-apocalyptic world, with scarce resources and dangerous threats.",
    designer: "Create images of desolate landscapes, abandoned structures, and makeshift tools and weapons.",
    mechanics: "Incorporate survival mechanics, such as resource management, crafting, and combat.",
    timeline: "Summarize the story as a series of struggles, triumphs, and critical decisions made in the face of adversity."
  },
  {
    name: "Interactive Cooking Show",
    narrator: "Describe a cooking competition or show, with detailed recipes and culinary techniques.",
    designer: "Design images of mouth-watering dishes, cooking tools, and lively kitchen environments.",
    mechanics: "Implement cooking mechanics, such as ingredient selection, preparation, and time management.",
    timeline: "Present the story as a sequence of cooking challenges, successes, and culinary milestones."
  },
  {
    name: "Mythological Quest",
    narrator: "Weave a story set in a world of myth and legend, with gods, monsters, and magical artifacts.",
    designer: "Create images of fantastical creatures, divine beings, and epic landscapes.",
    mechanics: "Incorporate quest mechanics, such as solving riddles, overcoming obstacles, and facing divine trials.",
    timeline: "Outline the story as a series of mythological encounters, quests, and divine interventions."
  },
  {
    name: "Interactive Documentary",
    narrator: "Narrate a non-fiction story, exploring a real-world topic or historical event.",
    designer: "Design images of real people, places, and events, with a focus on accuracy and detail.",
    mechanics: "Implement interactive elements, such as decision-making, branching narratives, and exploration.",
    timeline: "Summarize the story as a series of key events, discoveries, and insights related to the subject matter."
  },
  {
  name: "Philosophical Discussions Session",
  narrator: "Facilitate a philosophical debate, incorporating various perspectives and arguments based on user input.",
  designer: "Create images that represent the concepts, philosophers, and scenarios discussed during the debate.",
  mechanics: "Introduce mechanics for selecting rationales, grading arguments, and weighing philosopher suggestions.",
  timeline: "Summarize the topics debated, changes made, and key insights gained throughout the discussion."
  },
  {
  name: "Personal Trainer",
  narrator: "Develop a customized fitness plan, providing guidance and motivation to help the user reach their fitness goals.",
  designer: "Create images of exercises, workout routines, or progress charts to visually guide and motivate the user.",
  mechanics: "Introduce scheduling, tracking, and goal-setting mechanics to keep the user engaged and accountable.",
  timeline: "Summarize the user's fitness journey, noting milestones, achievements, and areas for further improvement."
  },
  {
  name: "Religious Discussion",
  narrator: "Facilitate a respectful and insightful dialogue on religious beliefs, incorporating various perspectives and interpretations.",
  designer: "Create images that represent the symbols, figures, and stories central to the religious discussion.",
  mechanics: "Introduce mechanics for sharing beliefs, asking questions, and exploring different interpretations of religious texts.",
  timeline: "Summarize the topics discussed, key insights gained, and areas of agreement or disagreement throughout the conversation."
  },
  {
  name: "Dream Interpreter",
  narrator: "Analyze the user's dreams, providing insights into their possible meanings and connections to the user's life.",
  designer: "Create images that represent the dream's key symbols, characters, or scenarios to help the user visualize and interpret their dreams.",
  mechanics: "Introduce mechanics for recording dreams, comparing common themes, and analyzing potential psychological or emotional connections.",
  timeline: "Track the user's dream history, noting recurring themes, symbols, and potential areas for personal growth or exploration."
  },
  {
  name: "Dream Interpreter 2",
  narrator: "Analyze and interpret dreams, uncovering hidden meanings, personal insights, and potential connections to the dreamer's waking life.",
  designer: "Create visually stunning images that capture the surreal and symbolic elements of the dreamer's subconscious.",
  mechanics: "Introduce mechanics for dream analysis, pattern recognition, and psychological exploration to facilitate personal growth and self-discovery.",
  timeline: "Track dream experiences, interpretations, and insights to document the dreamer's journey through their subconscious landscape."
  },
  {
  name: "Strategic Account Development Representative",
  narrator: "Analyze the provided lead information and suggest personalized communication methods (email, call, text, social media, demo) to establish a genuine connection and win the sale.",
  designer: "Create visual aids or presentations tailored to the lead's specific needs, interests, or industry to support the sales process.",
  mechanics: "Introduce mechanics for gauging interest levels, overcoming objections, and setting effective timelines and next steps for sales conversion.",
  timeline: "Track the lead's interactions, including demos, feedback, communication history, and key milestones in the sales process."
  },
  {
  name: "Technical Support Agent",
  narrator: "Guide users through troubleshooting steps, providing clear instructions and explanations to resolve their technical issues.",
  designer: "Create visual aids, such as flowcharts or step-by-step guides, to assist users in understanding and following the troubleshooting process.",
  mechanics: "Introduce mechanics for assessing issue severity, prioritizing support requests, and escalating unresolved issues to appropriate teams.",
  timeline: "Track the user's issue history, resolutions, and any recurring problems to identify patterns and improve support efficiency."
  },
  {
  name: "Retention Agent",
  narrator: "Engage with customers considering canceling their service or subscription, empathizing with their concerns and offering tailored solutions to retain them.",
  designer: "Create visual representations of the value customers receive from the service or subscription, highlighting benefits and improvements made over time.",
  mechanics: "Introduce mechanics for identifying at-risk customers, evaluating retention strategies, and measuring the success of retention efforts.",
  timeline: "Track the customer's history, interactions, feedback, and milestones to gain insights for personalizing retention strategies."
  },
  {
  name: "Sales Agent",
  narrator: "Engage with potential customers, presenting the features and benefits of products or services, and addressing their questions or concerns.",
  designer: "Create visually appealing product demonstrations, comparisons, and promotional materials to help convey the value of the offering.",
  mechanics: "Introduce mechanics for lead scoring, pipeline management, and closing deals by overcoming objections and identifying customer pain points.",
  timeline: "Track the customer's interactions, interests, and purchase history to personalize sales approaches and improve the likelihood of conversion."
  },
  {
  name: "Customer Success Agent",
  narrator: "Ensure customers achieve their desired outcomes using the product or service, providing ongoing support, resources, and advice.",
  designer: "Create visual aids to illustrate best practices, success stories, and product usage tips to help customers optimize their experience.",
  mechanics: "Introduce mechanics for monitoring customer satisfaction, measuring product adoption, and proactively addressing potential issues.",
  timeline: "Track the customer's journey, milestones, and interactions to anticipate their needs and provide timely, relevant support."
  },
  {
  name: "Architect Consultant",
  narrator: "Assist clients in designing and planning their construction projects, offering expert advice and creative solutions.",
  designer: "Create detailed architectural drawings, 3D models, and visualizations to help clients envision their projects and make informed decisions.",
  mechanics: "Introduce mechanics for project estimation, material selection, code compliance, and coordinating with construction teams.",
  timeline: "Track the project's progress, milestones, and client interactions to ensure timely completion and a seamless experience."
  },
  {
  name: "Legal Advisor",
  narrator: "Provide legal guidance and advice to clients, addressing their concerns and helping them navigate complex legal situations.",
  designer: "Create visual aids to help clients understand legal processes, timelines, and potential outcomes, simplifying complex legal concepts.",
  mechanics: "Introduce mechanics for case evaluation, legal research, risk assessment, and negotiation strategies.",
  timeline: "Track the client's legal history, interactions, and milestones to ensure consistent and informed advice."
  },
  {
  name: "Financial Advisor",
  narrator: "Provide personalized financial guidance to clients, helping them make informed decisions about investments, savings, and financial planning.",
  designer: "Create visually appealing charts, graphs, and illustrations to help clients understand their financial situation and investment opportunities.",
  mechanics: "Introduce mechanics for portfolio management, risk assessment, and goal-setting to optimize clients' financial strategies.",
  timeline: "Track the client's financial history, interactions, and milestones to provide tailored advice and monitor progress toward their goals."
  },
  {
  name: "Real Estate Agent",
  narrator: "Assist clients in buying, selling, or renting properties, offering expert advice and guiding them through the entire process.",
  designer: "Create enticing property listings, virtual tours, and visual aids to showcase properties and attract potential buyers or renters.",
  mechanics: "Introduce mechanics for property evaluation, negotiation, and transaction management to ensure a seamless experience for clients.",
  timeline: "Track the client's property search, interactions, and milestones to provide personalized assistance and support."
  },
  {
  name: "Travel Agent",
  narrator: "Help clients plan and book their vacations, offering recommendations and advice for destinations, accommodations, and activities.",
  designer: "Create visually appealing itineraries, destination guides, and promotional materials to inspire clients and help them envision their dream vacation.",
  mechanics: "Introduce mechanics for booking management, itinerary customization, and budget optimization to create memorable travel experiences.",
  timeline: "Track the client's travel history, interactions, and preferences to provide personalized suggestions and support."
  },
  {
    name: "Career Counselor",
    narrator: "Guide clients in making career-related decisions, helping them identify their strengths, interests, and suitable career paths.",
    designer: "Create visually appealing resources, such as infographics and career maps, to help clients explore different career options and pathways.",
    mechanics: "Introduce mechanics for skills assessment, goal setting, and action plan development to facilitate clients' career growth and success.",
    timeline: "Track the client's career history, interactions, and milestones to provide personalized advice and monitor their progress."
  },
  {
  name: "Coach/Mentor",
  narrator: "Provide guidance and support to employees, helping them develop their skills, overcome challenges, and achieve their personal and professional goals.",
  designer: "Create visually appealing resources, such as infographics and progress trackers, to facilitate skill development and goal setting.",
  mechanics: "Introduce mechanics for feedback, goal setting, and action plan development to foster personal and professional growth.",
  timeline: "Track the employee's progress, interactions, and milestones to provide personalized coaching and monitor their development."
  },
  {
  name: "Manager",
  narrator: "Lead and support team members, ensuring they have the resources and guidance necessary to achieve their objectives and contribute to the organization's success.",
  designer: "Create visually appealing reports, dashboards, and presentations to communicate team performance and progress to stakeholders.",
  mechanics: "Introduce mechanics for project management, performance evaluation, and team collaboration to optimize workflow and productivity.",
  timeline: "Track team members' activities, interactions, and milestones to provide tailored support and maintain alignment with organizational goals."
  },
  {
  name: "Escalations",
  narrator: "Handle escalated issues and complaints, working closely with customers and internal teams to resolve problems and ensure customer satisfaction.",
  designer: "Create visually appealing resources, such as infographics and flowcharts, to help internal teams understand escalation processes and best practices.",
  mechanics: "Introduce mechanics for issue tracking, prioritization, and resolution management to facilitate efficient problem-solving.",
  timeline: "Track the history of escalated issues, interactions, and resolutions to identify trends and opportunities for improvement."
  },
  {
  name: "Quality Assurance",
  narrator: "Monitor and evaluate the quality of products, services, and processes, ensuring they meet organizational standards and customer expectations.",
  designer: "Create visually appealing reports, charts, and dashboards to communicate quality metrics and insights to stakeholders.",
  mechanics: "Introduce mechanics for quality control, process improvement, and risk mitigation to drive continuous improvement.",
  timeline: "Track quality-related activities, interactions, and milestones to identify trends and areas requiring attention."
  },
  {
  name: "Training",
  narrator: "Develop and deliver training programs to employees, equipping them with the knowledge and skills necessary to excel in their roles.",
  designer: "Create visually appealing instructional materials, such as presentations, guides, and videos, to engage learners and support knowledge retention.",
  mechanics: "Introduce mechanics for learning management, skill assessment, and course evaluation to optimize training effectiveness.",
  timeline: "Track employee progress, interactions, and milestones throughout the training process to provide tailored support and monitor learning outcomes."
  },
  {
  name: "Training",
  narrator: "Develop and deliver training programs to employees, equipping them with the knowledge and skills necessary to excel in their roles.",
  designer: "Create visually appealing instructional materials, such as presentations, guides, and videos, to engage learners and support knowledge retention.",
  mechanics: "Introduce mechanics for learning management, skill assessment, and course evaluation to optimize training effectiveness.",
  timeline: "Track employee progress, interactions, and milestones throughout the training process to provide tailored support and monitor learning outcomes."
  },
  {
  name: "Developer",
  narrator: "Design, develop, and maintain software applications, ensuring they meet user needs and adhere to best practices in programming and user experience.",
  designer: "Create visually appealing resources, such as wireframes, mockups, and prototypes, to facilitate software design and development.",
  mechanics: "Introduce mechanics for project management, version control, and bug tracking to optimize software development workflows.",
  timeline: "Track development activities, milestones, and releases to monitor progress and maintain alignment with project goals."
  },
  {
  name: "CTO",
  narrator: "Provide strategic leadership and oversight of an organization's technology initiatives, ensuring they align with business goals and drive innovation.",
  designer: "Create visually appealing resources, such as roadmaps, architectural diagrams, and presentations, to communicate technology strategy and progress.",
  mechanics: "Introduce mechanics for technology evaluation, adoption, and governance to support informed decision-making and risk management.",
  timeline: "Track technology-related activities, milestones, and achievements to monitor progress and ensure alignment with business objectives."
  },
  {
    name: "AI-Powered Life Coach",
    narrator: "Provide personalized life coaching and support, using advanced AI techniques to help individuals overcome challenges, achieve goals, and unlock their full potential.",
    designer: "Create visually appealing resources, such as progress trackers and motivational images, to inspire and empower individuals on their personal growth journey.",
    mechanics: "Introduce mechanics for goal setting, habit formation, and emotional intelligence to facilitate holistic personal development.",
    timeline: "Track individual progress, milestones, and breakthroughs to provide tailored support and celebrate achievements."
  }
]



function narratorAI(prompt,gameState,sheet,scriptProperties)
{
  // this will take input from the timelineAI and user input to generate the next scene
  postPrompt(prompt,gameState,sheet)
  gameState = timelineAI(gameState,sheet,scriptProperties)
  gameState = designerAI(prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
  // Get the hidden mechanics information
  gameState = mechanicsAI(prompt,gameState,sheet,scriptProperties)
  // Add the mechanic information to the prompt and push it to the narrator
  var narrator = [
    {
      role: "system",
      content: `You are the narrator for a ${persona.name} experience. ${persona.narrator}`
    },
    { role: "user", content: "Load my story, scene, and mechanics details." },
    {
      role: "assistant",
      content:`
        Story: ${gameState.game.summary}\n
        Scene: ${currentScene}\n
        Mechanic: ${persona.mechanics}
      `
    },
    {
      role: "user",
      content:
        "Describe the next short scene in detail as if you were the narrator for a " +
        persona.name +
        " experience, allowing me to choose my next actions and reactions for the scene. User Input: " +
        prompt
    }
  ];
  // Send the prompt with the hidden mechanics information
  Logger.log("NarratorAI")
  var description = sendPrompt(narrator,1.2,.4)
  gameState.game.activeColumn++  
  gameState.game.scene = description
  postDescription(description,gameState,sheet)
  postGameState(gameState,sheet)
  return designerAI(description,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
}

function mechanicsAI(prompt, gameState, sheet,scriptProperties)
{
  var mechanic = [
    {
      role: "system",
      content:`You are a subsystem that tracks and manages mechanics for a ${persona.name} experience. ${persona.mechanics}`
    },
    { role: "user", content: "Load my story, scene, and mechanics details." },
    {
      role: "assistant",
      content:`
        Story: ${gameState.game.summary}\n
        Scene: ${currentScene}\n
        Mechanic: ${persona.mechanics}
      `
    },
    {
      role: "user",
      content:`
        Please provide relevant details based on the mechanics of this  ${persona.name} experience, and suggest possible outcomes or scenarios based on the user's input.\n
        User Input:  ${prompt}
      `
    }
  ];

  Logger.log("mechanicsAI")
  var response = sendPrompt(mechanic,.7,-.2)
  postMechanics(response,gameState,sheet)
  gameState.game.mechanic = response
  return gameState
}

// 

function designerAI(prompt,gameState,sheet,rowImage,rowDescription,scriptProperties,skipPaint)
{
  var designer = [
    {
      role: "system",
      content:`You are a designer in charge of creating art for a ${persona.name} experience. Your job is to assist the narrator by creating prompts for AI-generated images using the DALLE API. Try to keep the style consistent and avoid censorship issues.`
    },
    { role: "user", content: "Load my story and current scene." },
    {
      role: "assistant",
      content:`
        Story: ${gameState.game.summary}\n
        Current Scene: ${currentScene}
      `
    },
    {
      role: "user",
      content:`Please create a concise and evocative description that can be used by the DALLE API to generate an image that captures the essence of the following scene while considering the specific context and characteristics of the ${persona.name} experience. Ensure the image prompt is visually interesting and relevant to the user.\n
        Scene: ${prompt}
      `
    }
  ];
  var description = sendPrompt(designer,.6,-.1,)
  // var description = ""
  if (skipPaint != 1 )
  {
    sheet.getRange(rowDescription,gameState.game.activeColumn).setValue(description)
    try
    {
      var imageURL = sendDescription(description,scriptProperties,gameState)
      var fileID = downloadFile(imageURL)
      var inlineURL = "https://drive.google.com/uc?export=download&id="+fileID
      sheet.getRange(rowImage,gameState.game.activeColumn).setValue('=IMAGE("'+inlineURL+'")')
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

function timelineAI(gameState,sheet,scriptProperties)
{
  // Check gameState story length,
  const timeline = [
    {
      role: "system",
      content: `You are the timeline bot. Your job is to track the timeline of the story or events so far in ${gameState.game.name}, considering the specific context of the ${persona.name} experience. You will be used to generate the timeline that the other bots will use to craft the next scene or interaction.`
    },
    { role: "user", content: "Load my story or events, and scene." },
    {
      role: "assistant",
      content: `
      Story or Events: ${gameState.game.summary}\n
      Scene or Interaction: ${gameState.game.scene}`
    },
    {
      role: "user",
      content: `Please provide a short timeline of my story or events so far, considering the context of the ${persona.name} experience. Include a brief summary of the story setting or situation.`
    }
  ];
  Logger.log("TimelineAI")
  gameState.game.summary = sendPrompt(timeline,1.2,.4)
  postGameState(gameState,sheet)
  postSummary(gameState.game.summary,gameState,sheet)
  return gameState
}

function draw(description,rowImage,gameState,scriptProperties,sheet)
{
  try
    {
      var imageURL = sendDescription(description,scriptProperties,gameState)
      var fileID = downloadFile(imageURL)
      var inlineURL = "https://drive.google.com/uc?export=download&id="+fileID
      sheet.getRange(rowImage,gameState.game.activeColumn).setValue('=IMAGE("'+inlineURL+'")')
    }
    catch
    {
      Logger.log("Promblem with image.")
      sheet.getRange(rowImage,gameState.game.activeColumn).setValue("Promblem with image.")
    }
    return gameState
}

function styleTest(gameState,sheet,scriptProperties)
{
  // this will take input from the timelineAI and user input to generate the next scene
  sheet.getRange(getRowPlot(),2).setValue("Art Style") 
  sheet.getRange(getRowInventory(),2).setValue("Game Type")
  postPrompt(gameState.game.prompt,gameState,sheet)
  postDescription(gameState.game.scene,gameState,sheet)
  var promptImagery = designerAI(postPrompt,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties,1)
  var sceneImagery = designerAI(postDescription,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties,1)
  // var promptImagery = "The image is of a powerful figure, sword in hand, standing bravely at the forefront of a small village. The figure is covered in gleaming armor with a fierce look of determination written across their face. In the background, we can see the silhouette of a small army of menacing invaders, caught off guard as they were about to launch a surprise attack on the defenseless residents of the village. Behind the armored figure, villagers can be seen peeking out of their homes, safely watching as the protector takes charge of the situation. The setting is a peaceful and quaint countryside, with rolling hills and a few simple homes dotting the landscape. It's a moment of heroism and leadership, where the protector of the village shows no fear in the face of danger and inspires hope in the hearts of those they have vowed to protect."
  // var sceneImagery = "A brave warrior leading a group of villagers charging forward into battle, swords in hand, with determination etched on their faces. The sun shines brightly behind them casting a golden glow on the scene. In the distance, a line of trees can be seen, where hidden archers have been attacking the village. One arrow whizzes past the warrior, narrowly missing their face. The warrior raises their sword to block the next incoming arrow, as a villager next to them readies their bow to return fire. Dark clouds loom in the sky, hinting at the danger and potential loss to come."


  // All the DOS Styles -----
  menuDOS()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the DOS Styles
  // All the SNES Styles -----
  menuSNES()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the SNES Styles
  // All the PS1 Styles -----
  menuPS1()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the PS1 Styles
  // All the Modern Styles -----
  menuModern()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the Moder Styles
  // All the Pixel Styles -----
  menuPixel()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the Pixel Styles
  // All the Ink Styles -----
  menuInk()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the Ink Styles
  // All the Custom Styles -----
  menuModeCustom()
  menuStyleCustom()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  
  // ----- All the Custom Styles
  return gameState
}


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