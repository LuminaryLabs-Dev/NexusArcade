export const NEW_GAME_REQUIRED=[{path:"identity.concept",priority:3},{path:"player.fantasy",priority:3},{path:"gameplay.primaryVerb",priority:3},{path:"world.structure",priority:3},{path:"controls.joystick",priority:3},{path:"arcade.sessionLength",priority:2},{path:"challenge.failure",priority:2},{path:"progression.runStructure",priority:2},{path:"presentation.visualStyle",priority:2}];
export const newGameNodes=[
{id:"fantasy",fills:["player.fantasy"],priority:3,prompt:"What should the player mostly feel like they are doing?",choices:[
{id:"fight",label:"Fighting",writes:[{path:"player.fantasy",value:"fighting"},{path:"mechanics.combat",value:"required"}]},
{id:"drive",label:"Driving / Piloting",writes:[{path:"player.fantasy",value:"driving"},{path:"player.movement",value:"vehicle"},{path:"controls.joystick",value:"steering"}]},
{id:"explore",label:"Exploring",writes:[{path:"player.fantasy",value:"exploring"}]},
{id:"solve",label:"Solving",writes:[{path:"player.fantasy",value:"solving"}]},
{id:"build",label:"Building / Managing",writes:[{path:"player.fantasy",value:"building-managing"}]}]},
{id:"interaction",fills:["gameplay.primaryVerb"],priority:3,prompt:"What does the player do most often?",choices:[
{id:"move",label:"Move + Act",writes:[{path:"gameplay.primaryVerb",value:"move-and-act"},{path:"controls.joystick",value:"movement"}]},
{id:"aim",label:"Aim + Act",writes:[{path:"gameplay.primaryVerb",value:"aim-and-act"},{path:"controls.joystick",value:"aim"}]},
{id:"steer",label:"Steer + Speed",writes:[{path:"gameplay.primaryVerb",value:"steer-and-speed"},{path:"controls.joystick",value:"steering"},{path:"mechanics.physics",value:"vehicle"}]},
{id:"place",label:"Select + Place",writes:[{path:"gameplay.primaryVerb",value:"select-and-place"},{path:"controls.joystick",value:"selection"}]},
{id:"timing",label:"Timing / Rhythm",writes:[{path:"gameplay.primaryVerb",value:"timing"},{path:"controls.joystick",value:"selection"}]}]},
{id:"structure",fills:["world.structure","progression.runStructure"],priority:3,prompt:"How should a normal run be structured?",choices:[
{id:"arena",label:"Single Arena",writes:[{path:"world.structure",value:"arena"},{path:"progression.runStructure",value:"arena-run"}]},
{id:"levels",label:"Linear Levels",writes:[{path:"world.structure",value:"linear-levels"},{path:"progression.runStructure",value:"level-progression"}]},
{id:"branch",label:"Branching Levels",writes:[{path:"world.structure",value:"branching-levels"},{path:"progression.runStructure",value:"branching-run"}]},
{id:"endless",label:"Endless",writes:[{path:"world.structure",value:"endless"},{path:"progression.runStructure",value:"endless-run"}]},
{id:"run",label:"Run-Based",writes:[{path:"world.structure",value:"run-based"},{path:"progression.runStructure",value:"run-based"}]}]},
{id:"failure",fills:["challenge.failure"],priority:2,prompt:"What should most often end or hurt a run?",choices:[
{id:"health",label:"Health / Lives",writes:[{path:"challenge.failure",value:"health"}]},
{id:"timer",label:"Timer",writes:[{path:"challenge.failure",value:"timer"}]},
{id:"mistakes",label:"Mistakes Build Up",writes:[{path:"challenge.failure",value:"mistakes"}]},
{id:"objective",label:"Objective Fails",writes:[{path:"challenge.failure",value:"objective-failure"}]},
{id:"none",label:"No Hard Failure",writes:[{path:"challenge.failure",value:"none"}]}]},
{id:"session",fills:["arcade.sessionLength"],priority:2,prompt:"How long should a normal arcade run feel?",choices:[
{id:"2",label:"1–2 min",writes:[{path:"arcade.sessionLength",value:"1-2m"}]},
{id:"5",label:"3–5 min",writes:[{path:"arcade.sessionLength",value:"3-5m"}]},
{id:"7",label:"5–7 min",writes:[{path:"arcade.sessionLength",value:"5-7m"}]},
{id:"10",label:"7–10 min",writes:[{path:"arcade.sessionLength",value:"7-10m"}]},
{id:"var",label:"Variable",writes:[{path:"arcade.sessionLength",value:"variable"}]}]},
{id:"visual",fills:["presentation.visualStyle"],priority:2,prompt:"Which visual direction is closest?",choices:[
{id:"pixel",label:"Pixel / Retro 2D",writes:[{path:"presentation.visualStyle",value:"pixel"},{path:"presentation.dimensionality",value:"2D"}]},
{id:"low",label:"Low-Poly 3D",writes:[{path:"presentation.visualStyle",value:"low-poly"},{path:"presentation.dimensionality",value:"3D"}]},
{id:"cel",label:"Cel-Shaded",writes:[{path:"presentation.visualStyle",value:"cel-shaded"}]},
{id:"retro3d",label:"Retro 3D",writes:[{path:"presentation.visualStyle",value:"retro-3d"},{path:"presentation.dimensionality",value:"3D"}]},
{id:"abstract",label:"Abstract / Minimal",writes:[{path:"presentation.visualStyle",value:"abstract"}]}]}];
export const updateNodes=[
{id:"area",fills:["affectedArea"],priority:3,prompt:"What area do you want to update?",choices:["Gameplay","Player","Controls","Enemies","Levels / World","Scoring","Progression","Visuals","UI","Audio","Performance"].map((label,index)=>({id:`a${index}`,label,changeWrites:[{path:"affectedArea",value:label.toLowerCase()}]}))},
{id:"outcome",fills:["desiredOutcome"],priority:3,prompt:"What outcome are you mainly after?",choices:["Faster","Slower","Easier","Harder","Clearer","More Responsive","More Satisfying","Add Something","Remove Something"].map((label,index)=>({id:`o${index}`,label,changeWrites:[{path:"desiredOutcome",value:label.toLowerCase()}]}))}
];
