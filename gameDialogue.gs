function getPersonas() {
  return personas;
}

function setGameType(gameType) {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("gameType", gameType);
}

