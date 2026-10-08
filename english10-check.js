
const STORAGE="englishWorld_FINAL_2026";

let state=JSON.parse(localStorage.getItem(STORAGE))||{
  name:"Estudiante",
  xp:0,
  coins:100,
  level:"A1",
  streak:0,
  lastStudyDay:"",
  studyDays:[],
  lessonProgress:{},
  lessonPosition:{},
  lessonMistakes:{},
  mastered:[],
  difficult:[],
  errors:[],
  favorites:[],
  examPassed:false,
  quizLevel:1,
  quizRecord:0,
  achievements:[],
  inventory:[],
  theme:"light"
};

function saveState(){
  localStorage.setItem(STORAGE,JSON.stringify(state));
}

function todayKey(){
  const d=new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}

function normalizeText(text){
  return String(text||"")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .trim();
}

function shuffle(array){
  return [...array].sort(()=>Math.random()-.5);
}

function speakEnglish(word){
  if(!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const u=new SpeechSynthesisUtterance(word);
  u.lang="en-US";
  u.rate=.88;

  speechSynthesis.speak(u);
}

function toast(message){
  const el=document.getElementById("toast");
  el.textContent=message;
  el.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer=setTimeout(()=>{
    el.classList.remove("show");
  },2200);
}

function showModal(title,body){
  document.getElementById("modalTitle").textContent=title;
  document.getElementById("modalBody").innerHTML=body;
  document.getElementById("modalLayer").classList.add("show");
}

function closeModal(){
  document.getElementById("modalLayer").classList.remove("show");
}

function toggleMenu(){
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

function go(page){
  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  const target=document.getElementById(page);

  if(target){
    target.classList.add("active");
  }

  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");

  window.scrollTo({top:0,behavior:"smooth"});

  if(page==="levels") renderLevels();
  if(page==="lessons") renderLessons();
  if(page==="phrases") renderPhrases();
  if(page==="words") renderWords();
  if(page==="quiz") renderQuiz();
  if(page==="listening") renderListening();
  if(page==="writing") renderWriting();
  if(page==="achievements") renderAchievements();
  if(page==="profile") renderProfile();
  if(page==="shop") renderShop();
  if(page==="inventory") renderInventory();
  if(page==="missions") renderMissions();
  if(page==="calendar") renderCalendar();
  if(page==="collection") renderCollection();
  if(page==="review") renderReview();
}

function toggleTheme(){
  state.theme=state.theme==="dark"?"light":"dark";
  saveState();
  applyTheme();
}

function applyTheme(){
  document.body.classList.toggle("dark",state.theme==="dark");
}

function registerStudyDay(){

  const today=todayKey();

  if(!state.studyDays.includes(today)){
    state.studyDays.push(today);
  }

  if(state.lastStudyDay!==today){

    if(state.lastStudyDay){

      const previous=new Date(state.lastStudyDay);
      const current=new Date(today);

      const difference=Math.round(
        (current-previous)/(1000*60*60*24)
      );

      if(difference===1){
        state.streak=(state.streak||0)+1;
      }else{
        state.streak=1;
      }

    }else{
      state.streak=1;
    }

    state.lastStudyDay=today;
  }

  saveState();
  updateStats();
}

function updateStats(){

  document.getElementById("topName").textContent=state.name;
  document.getElementById("topXP").textContent=state.xp;
  document.getElementById("topCoins").textContent=state.coins;
  document.getElementById("topLevel").textContent=state.level;
  document.getElementById("topStreak").textContent=state.streak;

  document.getElementById("homeXP").textContent=state.xp+" XP";
  document.getElementById("homeStreak").textContent=
    state.streak+" días";

  document.getElementById("homeLessons").textContent=
    countCompletedLessons()+" / 10";
}

function lessonKey(index){
  return "A1-"+index;
}

function isLessonComplete(index){
  return state.lessonProgress[lessonKey(index)]===100;
}

function lessonProgress(index){
  return state.lessonProgress[lessonKey(index)]||0;
}

function countCompletedLessons(){
  let total=0;

  for(let i=0;i<20;i++){
    if(isLessonComplete(i)) total++;
  }

  return total;
}

function isLessonUnlocked(index){

  if(index===0) return true;

  return isLessonComplete(index-1);
}

/* =========================
   LECCIONES A1
========================= */

const lessons=[
  {
    title:"Saludos básicos",
    words:[
      ["hello","hola"],
      ["goodbye","adiós"],
      ["please","por favor"],
      ["thanks","gracias"],
      ["yes","sí"],
      ["no","no"],
      ["sorry","perdón"],
      ["welcome","bienvenido"],
      ["morning","mañana"],
      ["night","noche"]
    ]
  },
  {
    title:"La casa",
    words:[
      ["house","casa"],
      ["room","habitación"],
      ["door","puerta"],
      ["window","ventana"],
      ["table","mesa"],
      ["chair","silla"],
      ["bed","cama"],
      ["kitchen","cocina"],
      ["bathroom","baño"],
      ["garden","jardín"]
    ]
  },
  {
    title:"La familia",
    words:[
      ["mother","madre"],
      ["father","padre"],
      ["brother","hermano"],
      ["sister","hermana"],
      ["family","familia"],
      ["son","hijo"],
      ["daughter","hija"],
      ["child","niño"],
      ["man","hombre"],
      ["woman","mujer"]
    ]
  },
  {
    title:"Comida y bebidas",
    words:[
      ["water","agua"],
      ["food","comida"],
      ["bread","pan"],
      ["milk","leche"],
      ["coffee","café"],
      ["tea","té"],
      ["apple","manzana"],
      ["banana","banana"],
      ["rice","arroz"],
      ["meat","carne"]
    ]
  },
  {
    title:"La escuela",
    words:[
      ["school","escuela"],
      ["teacher","maestro"],
      ["student","estudiante"],
      ["book","libro"],
      ["pen","bolígrafo"],
      ["pencil","lápiz"],
      ["class","clase"],
      ["lesson","lección"],
      ["question","pregunta"],
      ["answer","respuesta"]
    ]
  },
  {
    title:"Transporte y lugares",
    words:[
      ["car","carro"],
      ["bus","autobús"],
      ["train","tren"],
      ["road","carretera"],
      ["street","calle"],
      ["city","ciudad"],
      ["country","país"],
      ["airport","aeropuerto"],
      ["station","estación"],
      ["ticket","boleto"]
    ]
  },
  {
    title:"Personas y trabajos",
    words:[
      ["friend","amigo"],
      ["work","trabajo"],
      ["job","empleo"],
      ["money","dinero"],
      ["shop","tienda"],
      ["market","mercado"],
      ["doctor","médico"],
      ["hospital","hospital"],
      ["police","policía"],
      ["restaurant","restaurante"]
    ]
  },
  {
    title:"Adjetivos",
    words:[
      ["big","grande"],
      ["small","pequeño"],
      ["good","bueno"],
      ["bad","malo"],
      ["hot","caliente"],
      ["cold","frío"],
      ["happy","feliz"],
      ["sad","triste"],
      ["fast","rápido"],
      ["slow","lento"]
    ]
  },
  {
    title:"Tiempo",
    words:[
      ["day","día"],
      ["week","semana"],
      ["month","mes"],
      ["year","año"],
      ["today","hoy"],
      ["tomorrow","mañana"],
      ["yesterday","ayer"],
      ["time","tiempo"],
      ["hour","hora"],
      ["minute","minuto"]
    ]
  },
  {
    title:"Acciones",
    words:[
      ["go","ir"],
      ["come","venir"],
      ["eat","comer"],
      ["drink","beber"],
      ["sleep","dormir"],
      ["read","leer"],
      ["write","escribir"],
      ["speak","hablar"],
      ["listen","escuchar"],
      ["learn","aprender"]
    ]
  },
  {
    title:"Presentaciones",
    words:[
      ["name","nombre"],
      ["first","primero"],
      ["last","último"],
      ["call","llamar"],
      ["meet","conocer"],
      ["people","personas"],
      ["hello","hola"],
      ["introduce","presentar"],
      ["live","vivir"],
      ["from","de"]
    ]
  },
  {
    title:"Objetos de la casa",
    words:[
      ["phone","teléfono"],
      ["computer","computadora"],
      ["book","libro"],
      ["bag","bolsa"],
      ["box","caja"],
      ["key","llave"],
      ["cup","taza"],
      ["plate","plato"],
      ["glass","vaso"],
      ["lamp","lámpara"]
    ]
  },
  {
    title:"Personas",
    words:[
      ["boy","niño"],
      ["girl","niña"],
      ["baby","bebé"],
      ["parent","padre"],
      ["teacher","maestro"],
      ["student","estudiante"],
      ["friend","amigo"],
      ["neighbor","vecino"],
      ["person","persona"],
      ["people","personas"]
    ]
  },
  {
    title:"Más comida",
    words:[
      ["orange","naranja"],
      ["egg","huevo"],
      ["cheese","queso"],
      ["chicken","pollo"],
      ["fish","pescado"],
      ["soup","sopa"],
      ["cake","pastel"],
      ["sugar","azúcar"],
      ["salt","sal"],
      ["juice","jugo"]
    ]
  },
  {
    title:"Escuela y estudio",
    words:[
      ["desk","escritorio"],
      ["classroom","salón"],
      ["test","examen"],
      ["homework","tarea"],
      ["schoolbag","mochila"],
      ["page","página"],
      ["word","palabra"],
      ["sentence","oración"],
      ["read","leer"],
      ["study","estudiar"]
    ]
  },
  {
    title:"Viajes y transporte",
    words:[
      ["plane","avión"],
      ["airport","aeropuerto"],
      ["hotel","hotel"],
      ["trip","viaje"],
      ["travel","viajar"],
      ["map","mapa"],
      ["train","tren"],
      ["bus","autobús"],
      ["driver","conductor"],
      ["car","carro"]
    ]
  },
  {
    title:"Compras",
    words:[
      ["store","tienda"],
      ["price","precio"],
      ["cheap","barato"],
      ["expensive","caro"],
      ["buy","comprar"],
      ["sell","vender"],
      ["pay","pagar"],
      ["cash","efectivo"],
      ["card","tarjeta"],
      ["size","talla"]
    ]
  },
  {
    title:"Emociones",
    words:[
      ["love","amor"],
      ["like","gustar"],
      ["want","querer"],
      ["need","necesitar"],
      ["feel","sentir"],
      ["angry","enojado"],
      ["afraid","asustado"],
      ["tired","cansado"],
      ["excited","emocionado"],
      ["okay","bien"]
    ]
  },
  {
    title:"Rutinas diarias",
    words:[
      ["wake","despertar"],
      ["wash","lavar"],
      ["dress","vestir"],
      ["work","trabajar"],
      ["cook","cocinar"],
      ["walk","caminar"],
      ["run","correr"],
      ["play","jugar"],
      ["watch","mirar"],
      ["rest","descansar"]
    ]
  },
  {
    title:"Conversación básica",
    words:[
      ["what","qué"],
      ["where","dónde"],
      ["when","cuándo"],
      ["who","quién"],
      ["why","por qué"],
      ["how","cómo"],
      ["here","aquí"],
      ["there","allí"],
      ["now","ahora"],
      ["later","después"]
    ]
  },
];

/* =========================
   VOCABULARIO EXTRA
========================= */

const extraWords=[
["mother","madre","Familia"],
["father","padre","Familia"],
["brother","hermano","Familia"],
["sister","hermana","Familia"],
["parent","padre/madre","Familia"],
["baby","bebé","Familia"],
["boy","niño","Familia"],
["girl","niña","Familia"],
["friend","amigo","Familia"],
["neighbor","vecino","Familia"],

["house","casa","Casa"],
["home","hogar","Casa"],
["wall","pared","Casa"],
["floor","piso","Casa"],
["roof","techo","Casa"],
["window","ventana","Casa"],
["door","puerta","Casa"],
["key","llave","Casa"],
["bedroom","dormitorio","Casa"],
["garage","garaje","Casa"],

["water","agua","Comida"],
["bread","pan","Comida"],
["rice","arroz","Comida"],
["meat","carne","Comida"],
["fish","pescado","Comida"],
["egg","huevo","Comida"],
["cheese","queso","Comida"],
["salt","sal","Comida"],
["sugar","azúcar","Comida"],
["juice","jugo","Comida"],

["school","escuela","Escuela"],
["teacher","maestro","Escuela"],
["student","estudiante","Escuela"],
["book","libro","Escuela"],
["notebook","cuaderno","Escuela"],
["pencil","lápiz","Escuela"],
["pen","bolígrafo","Escuela"],
["desk","escritorio","Escuela"],
["class","clase","Escuela"],
["test","examen","Escuela"],

["car","carro","Transporte"],
["bus","autobús","Transporte"],
["train","tren","Transporte"],
["plane","avión","Transporte"],
["bike","bicicleta","Transporte"],
["taxi","taxi","Transporte"],
["road","carretera","Transporte"],
["street","calle","Transporte"],
["ticket","boleto","Transporte"],
["station","estación","Transporte"],

["city","ciudad","Lugares"],
["country","país","Lugares"],
["airport","aeropuerto","Lugares"],
["school","escuela","Lugares"],
["hospital","hospital","Lugares"],
["hotel","hotel","Lugares"],
["store","tienda","Lugares"],
["park","parque","Lugares"],
["bank","banco","Lugares"],
["restaurant","restaurante","Lugares"],

["doctor","médico","Trabajo"],
["teacher","maestro","Trabajo"],
["driver","conductor","Trabajo"],
["worker","trabajador","Trabajo"],
["manager","gerente","Trabajo"],
["office","oficina","Trabajo"],
["company","empresa","Trabajo"],
["job","empleo","Trabajo"],
["money","dinero","Trabajo"],
["boss","jefe","Trabajo"],

["happy","feliz","Emociones"],
["sad","triste","Emociones"],
["angry","enojado","Emociones"],
["afraid","asustado","Emociones"],
["tired","cansado","Emociones"],
["excited","emocionado","Emociones"],
["calm","tranquilo","Emociones"],
["worried","preocupado","Emociones"],
["love","amor","Emociones"],
["hope","esperanza","Emociones"],

["big","grande","Adjetivos"],
["small","pequeño","Adjetivos"],
["good","bueno","Adjetivos"],
["bad","malo","Adjetivos"],
["new","nuevo","Adjetivos"],
["old","viejo","Adjetivos"],
["easy","fácil","Adjetivos"],
["hard","difícil","Adjetivos"],
["fast","rápido","Adjetivos"],
["slow","lento","Adjetivos"],

["red","rojo","Colores"],
["blue","azul","Colores"],
["green","verde","Colores"],
["yellow","amarillo","Colores"],
["black","negro","Colores"],
["white","blanco","Colores"],
["orange","naranja","Colores"],
["pink","rosado","Colores"],
["purple","morado","Colores"],
["brown","café","Colores"],

["one","uno","Números"],
["two","dos","Números"],
["three","tres","Números"],
["four","cuatro","Números"],
["five","cinco","Números"],
["six","seis","Números"],
["seven","siete","Números"],
["eight","ocho","Números"],
["nine","nueve","Números"],
["ten","diez","Números"],

["today","hoy","Tiempo"],
["tomorrow","mañana","Tiempo"],
["yesterday","ayer","Tiempo"],
["morning","mañana","Tiempo"],
["afternoon","tarde","Tiempo"],
["night","noche","Tiempo"],
["day","día","Tiempo"],
["week","semana","Tiempo"],
["month","mes","Tiempo"],
["year","año","Tiempo"],

["go","ir","Verbos"],
["come","venir","Verbos"],
["eat","comer","Verbos"],
["drink","beber","Verbos"],
["sleep","dormir","Verbos"],
["read","leer","Verbos"],
["write","escribir","Verbos"],
["speak","hablar","Verbos"],
["listen","escuchar","Verbos"],
["learn","aprender","Verbos"]
];

/* =========================
   FRASES
========================= */

const phrases=[
["Hello!","¡Hola!","Saludos"],
["Good morning!","¡Buenos días!","Saludos"],
["Good afternoon!","¡Buenas tardes!","Saludos"],
["Good night!","¡Buenas noches!","Saludos"],
["Goodbye!","¡Adiós!","Saludos"],
["See you later!","¡Hasta luego!","Saludos"],
["How are you?","¿Cómo estás?","Conversación"],
["I am fine.","Estoy bien.","Conversación"],
["Thank you.","Gracias.","Conversación"],
["You're welcome.","De nada.","Conversación"],
["Please help me.","Por favor ayúdame.","Conversación"],
["I don't understand.","No entiendo.","Conversación"],
["Can you repeat?","¿Puedes repetir?","Conversación"],
["What is your name?","¿Cómo te llamas?","Conversación"],
["My name is...","Me llamo...","Conversación"],

["Where is the bathroom?","¿Dónde está el baño?","Casa"],
["This is my house.","Esta es mi casa.","Casa"],
["Open the door.","Abre la puerta.","Casa"],
["Close the window.","Cierra la ventana.","Casa"],
["I am at home.","Estoy en casa.","Casa"],

["I am hungry.","Tengo hambre.","Comida"],
["I am thirsty.","Tengo sed.","Comida"],
["I want water.","Quiero agua.","Comida"],
["I like coffee.","Me gusta el café.","Comida"],
["The food is good.","La comida está buena.","Comida"],
["The bill, please.","La cuenta, por favor.","Restaurante"],

["How much is it?","¿Cuánto cuesta?","Compras"],
["I want this.","Quiero esto.","Compras"],
["It is too expensive.","Es demasiado caro.","Compras"],
["Do you have this?","¿Tienes esto?","Compras"],

["I go to school.","Voy a la escuela.","Escuela"],
["I am a student.","Soy estudiante.","Escuela"],
["The class starts now.","La clase empieza ahora.","Escuela"],
["I have a question.","Tengo una pregunta.","Escuela"],

["I am going to work.","Voy al trabajo.","Trabajo"],
["I have a job.","Tengo un trabajo.","Trabajo"],
["I am busy.","Estoy ocupado.","Trabajo"],
["I am free today.","Estoy libre hoy.","Trabajo"],

["Where is the bus?","¿Dónde está el autobús?","Transporte"],
["I need a ticket.","Necesito un boleto.","Transporte"],
["Where is the station?","¿Dónde está la estación?","Transporte"],
["I need a taxi.","Necesito un taxi.","Transporte"],

["I am happy.","Estoy feliz.","Emociones"],
["I am sad.","Estoy triste.","Emociones"],
["I am tired.","Estoy cansado.","Emociones"],
["I am worried.","Estoy preocupado.","Emociones"],

["What time is it?","¿Qué hora es?","Tiempo"],
["See you tomorrow.","Nos vemos mañana.","Tiempo"],
["See you next week.","Nos vemos la próxima semana.","Tiempo"],
["I am here now.","Estoy aquí ahora.","Tiempo"]
];

/* =========================
   NAVEGACIÓN DE NIVELES
========================= */

function renderLevels(){

  const levels=[
    ["A1","Principiante","Fundamentos del inglés",true],
    ["A2","Básico","Conversaciones cotidianas",state.examPassed],
    ["B1","Intermedio","Comunicación más avanzada",false],
    ["B2","Intermedio alto","Inglés avanzado",false]
  ];

  document.getElementById("levelsList").innerHTML=
    levels.map(l=>`

      <div class="card ${l[3]?"":"locked"}">

        <h2>${l[3]?"🔓":"🔒"} ${l[0]}</h2>

        <p>
          <b>${l[1]}</b><br>
          ${l[2]}
        </p>

        <br>

        ${
          l[3]
          ? `<button class="btn" onclick="go('lessons')">
              Entrar
             </button>`
          : `<span style="color:var(--muted)">
              Completa el nivel anterior
             </span>`
        }

      </div>

    `).join("");
}

/* =========================
   LECCIONES
========================= */

function renderLessons(){

  document.getElementById("lessonsList").innerHTML=
    lessons.map((lesson,index)=>{

      const unlocked=isLessonUnlocked(index);
      const progress=lessonProgress(index);

      return `

        <div class="card ${unlocked?"":"locked"}">

          <div class="lessonCard">

            <div class="lessonNumber">
              ${unlocked?(index+1):"🔒"}
            </div>

            <div style="flex:1">

              <h3>Lección ${index+1}</h3>

              <p>${lesson.title}</p>

              <div class="progress" style="margin-top:10px">

                <div
                  class="progressBar"
                  style="width:${progress}%"
                ></div>

              </div>

              <small style="color:var(--muted)">
                ${progress}% completado
              </small>

            </div>

          </div>

          <br>

          ${
            unlocked
            ? `<button class="btn"
                onclick="openLesson(${index})">
                ${progress===100?"🔁 Repetir":"▶️ Abrir"}
               </button>`
            : `<span style="color:var(--muted)">
                🔒 Completa la lección anterior
               </span>`
          }

        </div>

      `;

    }).join("");
}

let currentLesson=0;
let lessonCorrectCount=0;
let lessonFirstAttemptCount=0;
let currentQuestion=0;
let lessonMistakes=[];
let lessonQueue=[];
let lessonReviewIndex=0;
let lessonReviewRound=false;
let currentAnswered=false;

function openLesson(index){

  if(!isLessonUnlocked(index)){
    toast("🔒 Completa la lección anterior.");
    return;
  }

  currentLesson=index;
  lessonCorrectCount=0;
  lessonFirstAttemptCount=0;
  currentQuestion=0;
  lessonReviewIndex=0;
  lessonReviewRound=false;
  lessonQueue=[];
  currentAnswered=false;

  const key=lessonKey(index);

  if(isLessonComplete(index)){

    lessonMistakes=[];

    delete state.lessonPosition[key];
    delete state.lessonMistakes[key];

  }else{

    currentQuestion=
      state.lessonPosition[key]||0;

    lessonMistakes=
      state.lessonMistakes[key]||[];

  }

  saveState();

  showLessonIntro();
}

function showLessonIntro(){

  const lesson=lessons[currentLesson];

  let html=`

    <p style="color:var(--muted)">
      Antes de comenzar, estudia estas 10 palabras.
    </p>

    <div style="margin-top:15px">
  `;

  lesson.words.forEach((w,i)=>{

    html+=`

      <div class="word">

        <div>

          <div class="wordEnglish">
            ${i+1}. ${w[0]}
          </div>

          <div class="wordSpanish">
            ${w[1]}
          </div>

        </div>

        <button
          class="audioBtn"
          onclick="speakEnglish('${w[0].replace(/'/g,"\\'")}')">
          🔊
        </button>

      </div>

    `;

  });

  html+=`

    </div>

    <br>

    <button
      class="btn"
      onclick="startLessonExercises()">
      🚀 Comenzar ejercicios
    </button>

  `;

  showModal(
    `Lección ${currentLesson+1}: ${lesson.title}`,
    html
  );
}

function startLessonExercises(){

  closeModal();

  renderLessonQuestion();

}

function buildChoices(correct,all){

  const others=shuffle(
    all.filter(x=>x[0]!==correct[0])
  ).slice(0,3);

  return shuffle([correct,...others]);

}

function renderLessonQuestion(){

  const lesson=lessons[currentLesson];

  if(currentQuestion>=lesson.words.length){

    if(lessonMistakes.length){

      lessonReviewRound=true;
      lessonQueue=shuffle(lessonMistakes);
      lessonReviewIndex=0;

      renderReviewLessonQuestion();

    }else{

      finishLesson();

    }

    return;
  }

  lessonReviewRound=false;

  renderNormalLessonQuestion();

}

function renderNormalLessonQuestion(){

  const lesson=lessons[currentLesson];
  const item=lesson.words[currentQuestion];

  currentAnswered=false;

  const choices=buildChoices(
    item,
    lesson.words
  );

  let html=`

    <div class="card">

      <small style="color:var(--muted)">
        Palabra ${currentQuestion+1} de ${lesson.words.length}
      </small>

      <h2 style="margin-top:12px">
        ¿Cuál significa:
        <strong>${item[0]}</strong>?
      </h2>

      <div class="choices">

  `;

  choices.forEach(choice=>{

    html+=`

      <button
        class="choice"
        onclick="answerLesson('${encodeURIComponent(JSON.stringify(choice))}')">
        ${choice[1]}
      </button>

    `;

  });

  html+=`

      </div>

      <div id="lessonFeedback"></div>

    </div>

  `;

  document.getElementById("modalTitle").textContent=
    `Lección ${currentLesson+1}`;

  document.getElementById("modalBody").innerHTML=html;

  document.getElementById("modalLayer").classList.add("show");

}

function answerLesson(encoded){

  if(currentAnswered) return;

  currentAnswered=true;

  const selected=
    JSON.parse(decodeURIComponent(encoded));

  const lesson=lessons[currentLesson];
  const correct=lesson.words[currentQuestion];

  const buttons=document.querySelectorAll(".choice");

  buttons.forEach(btn=>{
    btn.disabled=true;

    if(normalizeText(btn.textContent)===
       normalizeText(correct[1])){

      btn.classList.add("correct");

    }
  });

  const isCorrect=
    normalizeText(selected[1])===
    normalizeText(correct[1]);

  if(isCorrect){

    lessonFirstAttemptCount++;
    lessonCorrectCount++;

    registerWordCorrect(correct[0]);

    document.getElementById("lessonFeedback").innerHTML=`

      <div class="feedback good">

        ✅ ¡Correcto!

        <br><br>

        <button
          class="btn"
          onclick="nextLessonQuestion()">
          Siguiente palabra →
        </button>

      </div>

    `;

  }else{

    lessonFirstAttemptCount++;

    registerWordWrong(correct[0]);

    if(!lessonMistakes.some(
      x=>x[0]===correct[0]
    )){
      lessonMistakes.push(correct);
    }

    document.getElementById("lessonFeedback").innerHTML=`

      <div class="feedback bad">

        ❌ Incorrecto.

        <br>
        La respuesta correcta es:
        <strong>${correct[1]}</strong>

        <br><br>

        <button
          class="btn"
          onclick="nextLessonQuestion()">
          Siguiente palabra →
        </button>

      </div>

    `;

  }

  saveLessonPosition();

}

function nextLessonQuestion(){

  currentQuestion++;

  saveLessonPosition();

  renderLessonQuestion();

}

function renderReviewLessonQuestion(){

  const item=lessonQueue[lessonReviewIndex];

  if(!item){

    if(lessonMistakes.length){

      lessonQueue=shuffle(lessonMistakes);
      lessonReviewIndex=0;
      renderReviewLessonQuestion();

    }else{

      finishLesson();

    }

    return;
  }

  currentAnswered=false;

  const choices=buildChoices(
    item,
    lessons[currentLesson].words
  );

  let html=`

    <div class="card">

      <small style="color:var(--muted)">
        🔄 Repaso de errores
      </small>

      <h2 style="margin-top:12px">
        ¿Cuál significa:
        <strong>${item[0]}</strong>?
      </h2>

      <div class="choices">

  `;

  choices.forEach(choice=>{

    html+=`

      <button
        class="choice"
        onclick="answerLessonReview('${encodeURIComponent(JSON.stringify(choice))}')">
        ${choice[1]}
      </button>

    `;

  });

  html+=`

      </div>

      <div id="lessonFeedback"></div>

    </div>

  `;

  document.getElementById("modalTitle").textContent=
    "🔄 Repaso";

  document.getElementById("modalBody").innerHTML=html;

}

function answerLessonReview(encoded){

  if(currentAnswered) return;

  currentAnswered=true;

  const selected=
    JSON.parse(decodeURIComponent(encoded));

  const item=lessonQueue[lessonReviewIndex];

  const isCorrect=
    normalizeText(selected[1])===
    normalizeText(item[1]);

  document.querySelectorAll(".choice").forEach(btn=>{
    btn.disabled=true;

    if(normalizeText(btn.textContent)===
      normalizeText(item[1])){

      btn.classList.add("correct");

    }
  });

  if(isCorrect){

    lessonMistakes=
      lessonMistakes.filter(
        x=>x[0]!==item[0]
      );

    registerWordCorrect(item[0]);

    document.getElementById("lessonFeedback").innerHTML=`

      <div class="feedback good">

        ✅ ¡Correcto! Error corregido.

        <br><br>

        <button
          class="btn"
          onclick="nextLessonReviewQuestion()">
          Siguiente →
        </button>

      </div>

    `;

  }else{

    document.getElementById("lessonFeedback").innerHTML=`

      <div class="feedback bad">

        ❌ Todavía hay que practicar esta palabra.

        <br><br>

        <button
          class="btn"
          onclick="nextLessonReviewQuestion()">
          Siguiente →
        </button>

      </div>

    `;

  }

  saveLessonPosition();

}

function nextLessonReviewQuestion(){

  lessonReviewIndex++;

  if(
    lessonReviewIndex>=lessonQueue.length
  ){

    if(lessonMistakes.length){

      lessonQueue=shuffle(lessonMistakes);
      lessonReviewIndex=0;

      renderReviewLessonQuestion();

    }else{

      finishLesson();

    }

  }else{

    renderReviewLessonQuestion();

  }

}

function saveLessonPosition(){

  const key=lessonKey(currentLesson);

  state.lessonPosition[key]=currentQuestion;
  state.lessonMistakes[key]=lessonMistakes;

  saveState();

}

function registerWordCorrect(word){

  if(!state.mastered.includes(word)){
    state.mastered.push(word);
  }

  state.difficult=
    state.difficult.filter(w=>w!==word);

  state.xp+=5;
  state.coins+=1;

  registerStudyDay();

  updateStats();

}

function registerWordWrong(word){

  if(!state.errors.includes(word)){
    state.errors.push(word);
  }

  if(!state.difficult.includes(word)){
    state.difficult.push(word);
  }

  saveState();

}

function finishLesson(){

  const key=lessonKey(currentLesson);

  const total=lessonFirstAttemptCount || 10;
  const percentage=Math.round(
    (lessonCorrectCount/total)*100
  );

  let stars="";
  let rating="";
  let bonusXP=10;

  if(percentage===100){
    stars="⭐⭐⭐⭐⭐";
    rating="¡Excelente!";
    bonusXP=30;
  }else if(percentage>=90){
    stars="⭐⭐⭐⭐";
    rating="¡Muy bien!";
    bonusXP=25;
  }else if(percentage>=70){
    stars="⭐⭐⭐";
    rating="¡Bien!";
    bonusXP=20;
  }else if(percentage>=50){
    stars="⭐⭐";
    rating="Sigue practicando";
    bonusXP=15;
  }else{
    stars="⭐";
    rating="Necesita repaso";
    bonusXP=10;
  }

  state.lessonProgress[key]=100;

  delete state.lessonPosition[key];
  delete state.lessonMistakes[key];

  state.xp+=bonusXP;
  state.coins+=10;

  registerStudyDay();

  saveState();

  renderLessons();
  updateStats();

  let nextButton="";

  if(currentLesson<19){

    nextButton=`
      <button
        class="btn success"
        onclick="goNextLesson()">
        Siguiente lección →
      </button>
    `;

  }else{

    nextButton=`
      <button
        class="btn gold"
        onclick="startA1Exam()">
        🏆 Ir al examen A1
      </button>
    `;

  }

  showModal(
    "🎉 ¡Lección completada!",
    `
      <div style="text-align:center">

        <h2>${rating}</h2>

        <div style="font-size:32px;margin:12px 0">
          ${stars}
        </div>

        <p style="font-size:22px;font-weight:bold">
          ${percentage}%
        </p>

        <p style="margin:12px 0;color:var(--muted)">
          Aciertos: ${lessonCorrectCount}/${total}
        </p>

        <p>
          ⭐ +${bonusXP} XP
          &nbsp;&nbsp;
          🪙 +10 monedas
        </p>

        <br>

        ${nextButton}

        <button
          class="btn secondary"
          onclick="closeModal()">
          Salir
        </button>

      </div>
    `
  );

}

function goNextLesson(){

  closeModal();

  if(currentLesson<9){

    openLesson(currentLesson+1);

  }

}

/* =========================
   PALABRAS
========================= */

let activeWordCategory="Todas";

function setupCategories(){

  const categories=[
    "Todas",
    ...new Set(extraWords.map(w=>w[2]))
  ];

  document.getElementById("wordFilters").innerHTML=
    categories.map(c=>`

      <button
        class="filter ${c==="Todas"?"active":""}"
        onclick="setWordCategory('${c.replace(/'/g,"\\'")}')">
        ${c}
      </button>

    `).join("");

  const phraseCategories=[
    "Todas",
    ...new Set(phrases.map(p=>p[2]))
  ];

  document.getElementById("phraseFilters").innerHTML=
    phraseCategories.map(c=>`

      <button
        class="filter ${c==="Todas"?"active":""}"
        onclick="setPhraseCategory('${c.replace(/'/g,"\\'")}')">
        ${c}
      </button>

    `).join("");

}

function setWordCategory(category){

  activeWordCategory=category;

  document.querySelectorAll("#wordFilters .filter")
    .forEach(btn=>{
      btn.classList.toggle(
        "active",
        btn.textContent===category
      );
    });

  renderWords();

}

function renderWords(){

  const search=normalizeText(
    document.getElementById("wordSearch")?.value
  );

  let data=extraWords.filter(w=>{

    const matchesCategory=
      activeWordCategory==="Todas" ||
      w[2]===activeWordCategory;

    const matchesSearch=
      !search ||
      normalizeText(w[0]).includes(search) ||
      normalizeText(w[1]).includes(search);

    return matchesCategory&&matchesSearch;

  });

  if(!data.length){

    document.getElementById("wordsList").innerHTML=
      `<p style="color:var(--muted)">
        No encontramos esa palabra.
       </p>`;

    return;
  }

  document.getElementById("wordsList").innerHTML=
    data.map(w=>`

      <div class="word">

        <div>

          <div class="wordEnglish">
            ${w[0]}
          </div>

          <div class="wordSpanish">
            ${w[1]} · ${w[2]}
          </div>

        </div>

        <div style="display:flex;gap:6px">

          <button
            class="audioBtn"
            onclick="speakEnglish('${w[0].replace(/'/g,"\\'")}')">
            🔊
          </button>

          <button
            class="audioBtn"
            onclick="toggleFavoriteWord('${w[0].replace(/'/g,"\\'")}')">
            ${state.favorites.includes(w[0])?"❤️":"🤍"}
          </button>

        </div>

      </div>

    `).join("");

}

function toggleFavoriteWord(word){

  if(state.favorites.includes(word)){

    state.favorites=
      state.favorites.filter(w=>w!==word);

  }else{

    state.favorites.push(word);

  }

  saveState();
  renderWords();

}

/* =========================
   FRASES
========================= */

let activePhraseCategory="Todas";

function setPhraseCategory(category){

  activePhraseCategory=category;

  document.querySelectorAll("#phraseFilters .filter")
    .forEach(btn=>{
      btn.classList.toggle(
        "active",
        btn.textContent===category
      );
    });

  renderPhrases();

}

function renderPhrases(){

  const search=normalizeText(
    document.getElementById("phraseSearch")?.value
  );

  const data=phrases.filter(p=>{

    const categoryOK=
      activePhraseCategory==="Todas" ||
      p[2]===activePhraseCategory;

    const searchOK=
      !search ||
      normalizeText(p[0]).includes(search) ||
      normalizeText(p[1]).includes(search);

    return categoryOK&&searchOK;

  });

  document.getElementById("phrasesList").innerHTML=
    data.map(p=>`

      <div class="card" style="margin-bottom:10px">

        <div style="display:flex;justify-content:space-between;gap:10px">

          <div>

            <strong>${p[0]}</strong>

            <p style="color:var(--muted);margin-top:5px">
              ${p[1]}
            </p>

            <small style="color:var(--muted)">
              ${p[2]}
            </small>

          </div>

          <button
            class="audioBtn"
            onclick="speakEnglish('${p[0].replace(/'/g,"\\'")}')">
            🔊
          </button>

        </div>

      </div>

    `).join("");

}

/* =========================
   INICIO
========================= */

applyTheme();
setupCategories();
updateStats();
renderLevels();
renderLessons();
renderWords();
renderPhrases();
saveState();




/* =========================
   QUIZ
========================= */

let quizCurrent=0;
let quizCorrect=0;
let quizLives=3;
let quizAnswered=false;
let quizQuestions=[];

function getQuizWords(){

  return lessons.flatMap(l=>l.words);

}

function renderQuiz(){

  document.getElementById("quizContent").innerHTML=`

    <div class="card">

      <h2>🏆 Nivel ${state.quizLevel}</h2>

      <p style="color:var(--muted);margin-top:8px">
        10 preguntas · 3 vidas · Necesitas 70% para avanzar
      </p>

      <br>

      <p>
        Récord:
        <strong>${state.quizRecord}/10</strong>
      </p>

      <br>

      <button class="btn" onclick="startQuiz()">
        🚀 Comenzar Quiz
      </button>

    </div>

  `;

}

function startQuiz(){

  const words=shuffle(getQuizWords());

  quizQuestions=words.slice(0,10);
  quizCurrent=0;
  quizCorrect=0;
  quizLives=3;
  quizAnswered=false;

  renderQuizQuestion();

}

function renderQuizQuestion(){

  if(quizCurrent>=quizQuestions.length){

    finishQuiz();
    return;

  }

  quizAnswered=false;

  const item=quizQuestions[quizCurrent];

  const choices=shuffle(
    getQuizWords()
      .filter(w=>w[0]!==item[0])
      .slice(0,8)
  ).slice(0,3);

  choices.push(item);

  const finalChoices=shuffle(choices);

  document.getElementById("quizContent").innerHTML=`

    <div class="card">

      <div style="display:flex;justify-content:space-between">

        <strong>
          Pregunta ${quizCurrent+1}/10
        </strong>

        <strong>
          ❤️ ${quizLives}
        </strong>

      </div>

      <h2 style="margin-top:20px">
        ¿Qué significa
        <strong>${item[0]}</strong>?
      </h2>

      <button
        class="audioBtn"
        style="margin-top:12px"
        onclick="speakEnglish('${item[0]}')">
        🔊 Escuchar
      </button>

      <div class="choices">

        ${finalChoices.map(choice=>`

          <button
            class="choice"
            onclick="answerQuiz('${encodeURIComponent(JSON.stringify(choice))}')">
            ${choice[1]}
          </button>

        `).join("")}

      </div>

      <div id="quizFeedback"></div>

    </div>

  `;

}

function answerQuiz(encoded){

  if(quizAnswered) return;

  quizAnswered=true;

  const selected=
    JSON.parse(decodeURIComponent(encoded));

  const correct=quizQuestions[quizCurrent];

  const isCorrect=
    normalizeText(selected[1])===
    normalizeText(correct[1]);

  document.querySelectorAll("#quizContent .choice")
    .forEach(btn=>{

      btn.disabled=true;

      if(
        normalizeText(btn.textContent)===
        normalizeText(correct[1])
      ){
        btn.classList.add("correct");
      }

    });

  if(isCorrect){

    quizCorrect++;

    state.xp+=10;
    state.coins+=2;

    registerStudyDay();

    document.getElementById("quizFeedback").innerHTML=`

      <div class="feedback good">

        ✅ ¡Correcto!

        <br><br>

        <button
          class="btn"
          onclick="nextQuizQuestion()">
          Siguiente →
        </button>

      </div>

    `;

  }else{

    quizLives--;

    document.getElementById("quizFeedback").innerHTML=`

      <div class="feedback bad">

        ❌ Incorrecto.

        <br>
        Respuesta:
        <strong>${correct[1]}</strong>

        <br><br>

        ${
          quizLives>0
          ? `<button class="btn"
               onclick="nextQuizQuestion()">
               Siguiente →
             </button>`
          : `<button class="btn danger"
               onclick="finishQuiz()">
               Terminar
             </button>`
        }

      </div>

    `;

  }

  saveState();
  updateStats();

}

function nextQuizQuestion(){

  quizCurrent++;

  if(quizLives<=0){

    finishQuiz();

  }else{

    renderQuizQuestion();

  }

}

function finishQuiz(){

  if(quizCorrect>state.quizRecord){
    state.quizRecord=quizCorrect;
  }

  const percentage=
    Math.round((quizCorrect/10)*100);

  if(percentage>=70 && state.quizLevel<5){

    state.quizLevel++;

  }

  saveState();

  document.getElementById("quizContent").innerHTML=`

    <div class="card">

      <h2>🎉 Quiz terminado</h2>

      <p style="font-size:24px;margin:15px 0">
        ${quizCorrect}/10
      </p>

      <p>
        Resultado:
        <strong>${percentage}%</strong>
      </p>

      <br>

      ${
        percentage>=70
        ? `<p>🏆 ¡Nivel superado!</p>`
        : `<p>💪 Sigue practicando.</p>`
      }

      <br>

      <button class="btn" onclick="startQuiz()">
        🔄 Repetir
      </button>

    </div>

  `;

  updateStats();

}

/* =========================
   LISTENING
========================= */

let listeningCurrent=null;
let listeningAnswered=false;

function renderListening(){

  if(!listeningCurrent){

    document.getElementById("listeningContent").innerHTML=`

      <div class="card">

        <h2>🎧 Entrenamiento auditivo</h2>

        <p style="color:var(--muted);margin:10px 0">
          Escucha una palabra y selecciona su significado.
        </p>

        <button
          class="btn"
          onclick="startListening()">
          ▶️ Comenzar
        </button>

      </div>

    `;

    return;

  }

  renderListeningQuestion();

}

function startListening(){

  const all=getQuizWords();

  listeningCurrent=
    all[Math.floor(Math.random()*all.length)];

  listeningAnswered=false;

  renderListeningQuestion();

}

function renderListeningQuestion(){

  const item=listeningCurrent;

  const choices=shuffle(
    getQuizWords()
      .filter(w=>w[0]!==item[0])
      .slice(0,3)
      .concat([item])
  );

  document.getElementById("listeningContent").innerHTML=`

    <div class="card">

      <h2>🎧 Escucha</h2>

      <button
        class="audioBtn"
        style="margin-top:15px"
        onclick="speakEnglish('${item[0]}')">
        🔊
      </button>

      <div class="choices">

        ${choices.map(c=>`

          <button
            class="choice"
            onclick="answerListening('${encodeURIComponent(JSON.stringify(c))}')">
            ${c[1]}
          </button>

        `).join("")}

      </div>

      <div id="listeningFeedback"></div>

    </div>

  `;

  setTimeout(()=>{
    speakEnglish(item[0]);
  },350);

}

function answerListening(encoded){

  if(listeningAnswered) return;

  listeningAnswered=true;

  const selected=
    JSON.parse(decodeURIComponent(encoded));

  const correct=listeningCurrent;

  const ok=
    normalizeText(selected[1])===
    normalizeText(correct[1]);

  document.querySelectorAll("#listeningContent .choice")
    .forEach(btn=>{

      btn.disabled=true;

      if(normalizeText(btn.textContent)===
        normalizeText(correct[1])){

        btn.classList.add("correct");

      }

    });

  if(ok){

    state.xp+=5;
    state.coins+=1;

    registerStudyDay();

    document.getElementById("listeningFeedback").innerHTML=`

      <div class="feedback good">

        ✅ Correcto

        <br><br>

        <button
          class="btn"
          onclick="startListening()">
          Siguiente →
        </button>

      </div>

    `;

  }else{

    document.getElementById("listeningFeedback").innerHTML=`

      <div class="feedback bad">

        ❌ Incorrecto.

        <br>
        Era:
        <strong>${correct[1]}</strong>

        <br><br>

        <button
          class="btn"
          onclick="startListening()">
          Siguiente →
        </button>

      </div>

    `;

  }

  saveState();
  updateStats();

}

/* =========================
   WRITING
========================= */

let writingCurrent=null;

function renderWriting(){

  if(!writingCurrent){

    document.getElementById("writingContent").innerHTML=`

      <div class="card">

        <h2>✍️ Práctica de escritura</h2>

        <p style="color:var(--muted);margin:10px 0">
          Escribe en inglés la palabra que aparece en español.
        </p>

        <button
          class="btn"
          onclick="startWriting()">
          ▶️ Comenzar
        </button>

      </div>

    `;

    return;

  }

  renderWritingQuestion();

}

function startWriting(){

  const all=getQuizWords();

  writingCurrent=
    all[Math.floor(Math.random()*all.length)];

  renderWritingQuestion();

}

function renderWritingQuestion(){

  const item=writingCurrent;

  document.getElementById("writingContent").innerHTML=`

    <div class="card">

      <small style="color:var(--muted)">
        Escribe en inglés:
      </small>

      <h2 style="margin:12px 0">
        ${item[1]}
      </h2>

      <input
        id="writingInput"
        class="search"
        placeholder="Escribe aquí..."
        autocomplete="off"
      >

      <div style="display:flex;gap:8px;flex-wrap:wrap">

        <button
          class="btn"
          onclick="checkWriting()">
          Comprobar
        </button>

        <button
          class="audioBtn"
          onclick="speakEnglish('${item[0]}')">
          🔊
        </button>

      </div>

      <div id="writingFeedback"></div>

    </div>

  `;

  setTimeout(()=>{
    document.getElementById("writingInput")?.focus();
  },100);

}

function checkWriting(){

  const input=
    normalizeText(
      document.getElementById("writingInput").value
    );

  const correct=
    normalizeText(writingCurrent[0]);

  if(input===correct){

    state.xp+=8;
    state.coins+=2;

    registerStudyDay();

    document.getElementById("writingFeedback").innerHTML=`

      <div class="feedback good">

        ✅ ¡Perfecto!

        <br><br>

        <button
          class="btn"
          onclick="startWriting()">
          Siguiente →
        </button>

      </div>

    `;

  }else{

    document.getElementById("writingFeedback").innerHTML=`

      <div class="feedback bad">

        ❌ Inténtalo de nuevo.

        <br>
        Respuesta correcta:
        <strong>${writingCurrent[0]}</strong>

        <br><br>

        <button
          class="btn"
          onclick="startWriting()">
          Siguiente →
        </button>

      </div>

    `;

  }

  saveState();
  updateStats();

}

/* =========================
   PERFIL
========================= */

const avatars=[
  "🙂",
  "😎",
  "🤓",
  "🧑‍🎓",
  "👨‍🚀",
  "🦊",
  "🐱",
  "🐼",
  "🐲",
  "🦁"
];

function renderProfile(){

  document.getElementById("profileContent").innerHTML=`

    <div class="card">

      <div style="text-align:center">

        <div style="font-size:70px">
          ${state.avatar||"🙂"}
        </div>

        <h2>${state.name}</h2>

        <p style="color:var(--muted)">
          Nivel ${state.level}
        </p>

      </div>

      <br>

      <div class="grid">

        <div class="card">
          ⭐<br>
          <strong>${state.xp}</strong> XP
        </div>

        <div class="card">
          🪙<br>
          <strong>${state.coins}</strong> monedas
        </div>

        <div class="card">
          🔥<br>
          <strong>${state.streak}</strong> días
        </div>

        <div class="card">
          🧠<br>
          <strong>${state.mastered.length}</strong> dominadas
        </div>

      </div>

      <br>

      <button
        class="btn"
        onclick="changeName()">
        ✏️ Cambiar nombre
      </button>

      <button
        class="btn secondary"
        onclick="chooseAvatar()">
        🎭 Cambiar avatar
      </button>

      <button
        class="btn secondary"
        onclick="exportProgress()">
        💾 Exportar progreso
      </button>

      <button
        class="btn secondary"
        onclick="document.getElementById('importFile').click()">
        📥 Importar progreso
      </button>

      <input
        id="importFile"
        type="file"
        accept=".json"
        style="display:none"
        onchange="importProgress(event)"
      >

    </div>

  `;

}

function changeName(){

  const name=prompt(
    "Escribe tu nuevo nombre:",
    state.name
  );

  if(name && name.trim()){

    state.name=name.trim();

    saveState();
    updateStats();
    renderProfile();

  }

}

function chooseAvatar(){

  showModal(
    "🎭 Elegir avatar",
    `

      <div class="grid">

        ${avatars.map(a=>`

          <button
            class="card"
            style="font-size:40px;cursor:pointer"
            onclick="setAvatar('${a}')">
            ${a}
          </button>

        `).join("")}

      </div>

    `
  );

}

function setAvatar(avatar){

  state.avatar=avatar;

  saveState();
  closeModal();
  renderProfile();

}

/* =========================
   TIENDA
========================= */

const shopItems=[
  ["avatar_crown","👑 Corona","Avatar especial",80],
  ["avatar_robot","🤖 Robot","Avatar robot",100],
  ["avatar_dragon","🐲 Dragón","Avatar dragón",150],
  ["avatar_alien","👽 Alien","Avatar alienígena",180],
  ["frame_gold","🟡 Marco dorado","Marco premium",120],
  ["frame_fire","🔥 Marco fuego","Marco especial",180],
  ["background_space","🌌 Espacio","Fondo espacial",150],
  ["background_forest","🌲 Bosque","Fondo natural",120],
  ["effect_star","✨ Estrellas","Efecto especial",200],
  ["effect_fire","🔥 Fuego","Efecto especial",250],
  ["streak_protection","🛡️ Protección","Protege una racha",100]
];

function renderShop(){

  document.getElementById("shopList").innerHTML=
    shopItems.map(item=>{

      const owned=state.inventory.includes(item[0]);

      return `

        <div class="card">

          <div style="font-size:35px">
            ${item[1].split(" ")[0]}
          </div>

          <h3>${item[1]}</h3>

          <p>${item[2]}</p>

          <br>

          <strong>🪙 ${item[3]}</strong>

          <br><br>

          ${
            owned
            ? `<button class="btn secondary"
                 onclick="equipItem('${item[0]}')">
                 Equipar
               </button>`
            : `<button class="btn"
                 onclick="buyItem('${item[0]}')">
                 Comprar
               </button>`
          }

        </div>

      `;

    }).join("");

}

function buyItem(id){

  const item=shopItems.find(x=>x[0]===id);

  if(!item) return;

  if(state.inventory.includes(id)){

    toast("Ya tienes este objeto.");
    return;

  }

  if(state.coins<item[3]){

    toast("🪙 No tienes suficientes monedas.");
    return;

  }

  state.coins-=item[3];
  state.inventory.push(id);

  saveState();

  updateStats();
  renderShop();
  renderInventory();

  toast("🎉 Objeto comprado.");

}

function equipItem(id){

  if(!state.inventory.includes(id)) return;

  state.equippedItem=id;

  // Si es un avatar, también lo convertimos en avatar activo
  const avatar=shopItems.find(item=>item[0]===id);

  if(avatar && id.startsWith("avatar_")){
    state.equippedAvatar=avatar[1].split(" ")[0];
  }

  saveState();

  toast("✨ Objeto equipado.");

  renderInventory();
  renderProfile();
  updateStats();

}

/* =========================
   INVENTARIO
========================= */

function renderInventory(){

  if(!state.inventory.length){

    document.getElementById("inventoryList").innerHTML=`

      <div class="card">

        <h3>🎒 Inventario vacío</h3>

        <p>
          Compra objetos en la tienda.
        </p>

      </div>

    `;

    return;

  }

  document.getElementById("inventoryList").innerHTML=
    state.inventory.map(id=>{

      const item=shopItems.find(x=>x[0]===id);

      if(!item) return "";

      const equipped=
        state.equippedItem===id;

      return `

        <div class="card">

          <div style="font-size:35px">
            ${item[1].split(" ")[0]}
          </div>

          <h3>${item[1]}</h3>

          <p>${item[2]}</p>

          <br>

          ${
            equipped
            ? `<strong>✅ Equipado</strong>`
            : `<button
                 class="btn"
                 onclick="equipItem('${id}')">
                 Equipar
               </button>`
          }

        </div>

      `;

    }).join("");

}

/* =========================
   MISIONES
========================= */

function renderMissions(){

  const today=todayKey();

  const completed=countCompletedLessons();

  document.getElementById("missionsList").innerHTML=`

    <div class="card">

      <h3>📚 Estudia una lección</h3>

      <p>
        Completa una lección.
      </p>

      <br>

      <strong>
        ${Math.min(completed,1)}/1
      </strong>

    </div>

    <div class="card">

      <h3>🔥 Mantén tu racha</h3>

      <p>
        Estudia hoy.
      </p>

      <br>

      <strong>
        ${state.lastStudyDay===today?"1":"0"}/1
      </strong>

    </div>

    <div class="card">

      <h3>🧠 Aprende palabras</h3>

      <p>
        Domina 5 palabras nuevas.
      </p>

      <br>

      <strong>
        ${Math.min(state.mastered.length,5)}/5
      </strong>

    </div>

    <div class="card">

      <h3>🎧 Practica Listening</h3>

      <p>
        Haz una práctica de listening.
      </p>

      <br>

      <strong>
        Practica para completarla.
      </strong>

    </div>

  `;

}

/* =========================
   CALENDARIO
========================= */

function renderCalendar(){

  const today=new Date();

  let html=`

    <div class="card">

      <h2>
        ${today.toLocaleString("es",{month:"long"})}
        ${today.getFullYear()}
      </h2>

      <div
        style="
          display:grid;
          grid-template-columns:repeat(7,1fr);
          gap:6px;
          margin-top:15px;
        "
      >

  `;

  const days=["L","M","X","J","V","S","D"];

  days.forEach(d=>{
    html+=`
      <strong style="text-align:center">
        ${d}
      </strong>
    `;
  });

  const first=new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  let start=first.getDay();

  start=start===0?6:start-1;

  for(let i=0;i<start;i++){

    html+=`<div></div>`;

  }

  const totalDays=
    new Date(
      today.getFullYear(),
      today.getMonth()+1,
      0
    ).getDate();

  for(let day=1;day<=totalDays;day++){

    const key=
      today.getFullYear()+"-"+
      String(today.getMonth()+1).padStart(2,"0")+"-"+
      String(day).padStart(2,"0");

    const studied=
      state.studyDays.includes(key);

    html+=`

      <div
        style="
          text-align:center;
          padding:9px 3px;
          border-radius:9px;
          background:${studied?"#2563eb":"var(--bg)"};
          color:${studied?"white":"var(--text)"};
        "
      >
        ${day}
      </div>

    `;

  }

  html+=`

      </div>

    </div>

  `;

  document.getElementById("calendarContent").innerHTML=html;

}

/* =========================
   LOGROS
========================= */

const achievementsData=[
  ["first","🎯","Primera lección","Completa una lección."],
  ["five","🔥","Cinco lecciones","Completa cinco lecciones."],
  ["ten","🏆","Diez lecciones","Completa las diez lecciones A1."],
  ["words50","📖","50 palabras","Domina 50 palabras."],
  ["streak7","🔥","Una semana","Consigue una racha de 7 días."],
  ["quiz","🧠","Quiz experto","Llega al nivel 5 del Quiz."],
  ["master","👑","Maestro de English World","Completa A1 y aprueba el examen."]
];

function checkAchievements(){

  const completed=countCompletedLessons();

  const conditions={
    first:completed>=1,
    five:completed>=5,
    ten:completed>=10,
    words50:state.mastered.length>=50,
    streak7:state.streak>=7,
    quiz:state.quizLevel>=5,
    master:completed>=10 && state.examPassed
  };

  achievementsData.forEach(a=>{

    if(
      conditions[a[0]] &&
      !state.achievements.includes(a[0])
    ){

      state.achievements.push(a[0]);

      state.xp+=50;
      state.coins+=25;

      toast("🏆 Logro desbloqueado: "+a[2]);

    }

  });

  saveState();

}

function renderAchievements(){

  checkAchievements();

  document.getElementById("achievementsList").innerHTML=
    achievementsData.map(a=>{

      const unlocked=
        state.achievements.includes(a[0]);

      return `

        <div
          class="card"
          style="opacity:${unlocked?1:.45}"
        >

          <div style="font-size:40px">
            ${a[1]}
          </div>

          <h3>${a[2]}</h3>

          <p>${a[3]}</p>

          <br>

          <strong>
            ${unlocked?"🏆 Desbloqueado":"🔒 Bloqueado"}
          </strong>

        </div>

      `;

    }).join("");

}

/* =========================
   COLECCIÓN
========================= */

function renderCollection(){

  const unlocked=state.achievements.length;

  document.getElementById("collectionList").innerHTML=`

    <div class="card">

      <h2>🏆 Insignias</h2>

      <p>
        ${unlocked} de ${achievementsData.length}
      </p>

    </div>

    <div class="card">

      <h2>🎭 Avatares</h2>

      <p>
        ${state.avatar||"🙂"} Avatar actual
      </p>

    </div>

    <div class="card">

      <h2>✨ Objetos</h2>

      <p>
        ${state.inventory.length} objetos
      </p>

    </div>

  `;

}

/* =========================
   REPASO
========================= */

function renderReview(){

  if(!state.difficult.length){

    document.getElementById("reviewContent").innerHTML=`

      <div class="card">

        <h2>🎉 ¡Excelente!</h2>

        <p>
          No tienes palabras marcadas como difíciles.
        </p>

      </div>

    `;

    return;

  }

  document.getElementById("reviewContent").innerHTML=`

    <div class="card">

      <h2>📚 Palabras para repasar</h2>

      <p style="color:var(--muted);margin:10px 0">
        Estas palabras necesitan más práctica.
      </p>

      <div style="margin-top:15px">

        ${state.difficult.map(word=>`

          <div class="word">

            <strong>${word}</strong>

            <button
              class="audioBtn"
              onclick="speakEnglish('${word}')">
              🔊
            </button>

          </div>

        `).join("")}

      </div>

    </div>

  `;

}

/* =========================
   EXPORTAR / IMPORTAR
========================= */

function exportProgress(){

  const data=JSON.stringify(
    state,
    null,
    2
  );

  const blob=new Blob(
    [data],
    {type:"application/json"}
  );

  const url=URL.createObjectURL(blob);

  const a=document.createElement("a");

  a.href=url;
  a.download="english-world-progreso.json";

  a.click();

  URL.revokeObjectURL(url);

}

function importProgress(event){

  const file=event.target.files[0];

  if(!file) return;

  const reader=new FileReader();

  reader.onload=e=>{

    try{

      const imported=
        JSON.parse(e.target.result);

      if(typeof imported!=="object"){
        throw new Error();
      }

      state={
        ...state,
        ...imported
      };

      saveState();

      applyTheme();
      updateStats();
      renderProfile();
      renderLessons();
      renderLevels();

      toast("✅ Progreso importado.");

    }catch{

      toast("❌ Archivo inválido.");

    }

  };

  reader.readAsText(file);

}

/* =========================
   EXAMEN A1
========================= */

let examQuestions=[];
let examCurrent=0;
let examCorrect=0;
let examAnswered=false;

function startA1Exam(){

  closeModal();

  const words=shuffle(getQuizWords());

  examQuestions=words.slice(0,20);
  examCurrent=0;
  examCorrect=0;
  examAnswered=false;

  renderExamQuestion();

}

function renderExamQuestion(){

  if(examCurrent>=examQuestions.length){

    finishA1Exam();
    return;

  }

  examAnswered=false;

  const item=examQuestions[examCurrent];

  const wrongs=
    shuffle(
      getQuizWords()
      .filter(w=>w[0]!==item[0])
    ).slice(0,3);

  const choices=shuffle([
    item,
    ...wrongs
  ]);

  showModal(
    "🏆 Examen A1",
    `

      <small style="color:var(--muted)">
        Pregunta ${examCurrent+1} de 20
      </small>

      <h2 style="margin-top:12px">
        ¿Qué significa
        <strong>${item[0]}</strong>?
      </h2>

      <button
        class="audioBtn"
        style="margin-top:12px"
        onclick="speakEnglish('${item[0]}')">
        🔊
      </button>

      <div class="choices">

        ${choices.map(c=>`

          <button
            class="choice"
            onclick="answerExam('${encodeURIComponent(JSON.stringify(c))}')">
            ${c[1]}
          </button>

        `).join("")}

      </div>

      <div id="examFeedback"></div>

    `
  );

}

function answerExam(encoded){

  if(examAnswered) return;

  examAnswered=true;

  const selected=
    JSON.parse(decodeURIComponent(encoded));

  const correct=examQuestions[examCurrent];

  const ok=
    normalizeText(selected[1])===
    normalizeText(correct[1]);

  document.querySelectorAll("#modalBody .choice")
    .forEach(btn=>{

      btn.disabled=true;

      if(normalizeText(btn.textContent)===
        normalizeText(correct[1])){

        btn.classList.add("correct");

      }

    });

  if(ok){

    examCorrect++;

    document.getElementById("examFeedback").innerHTML=`

      <div class="feedback good">

        ✅ Correcto

        <br><br>

        <button
          class="btn"
          onclick="nextExamQuestion()">
          Siguiente →
        </button>

      </div>

    `;

  }else{

    document.getElementById("examFeedback").innerHTML=`

      <div class="feedback bad">

        ❌ Incorrecto.

        <br>
        Correcta:
        <strong>${correct[1]}</strong>

        <br><br>

        <button
          class="btn"
          onclick="nextExamQuestion()">
          Siguiente →
        </button>

      </div>

    `;

  }

}

function nextExamQuestion(){

  examCurrent++;

  renderExamQuestion();

}

function finishA1Exam(){

  const percentage=
    Math.round((examCorrect/20)*100);

  if(percentage>=70){

    state.examPassed=true;
    state.level="A2";

    state.xp+=200;
    state.coins+=100;

    saveState();

    renderLevels();
    renderAchievements();
    updateStats();

    showModal(
      "🎉 ¡A1 COMPLETADO!",
      `

        <div style="text-align:center">

          <div style="font-size:70px">
            🏆
          </div>

          <h2>
            ¡Excelente trabajo!
          </h2>

          <p style="margin:12px 0">
            Resultado:
            <strong>${examCorrect}/20</strong>
            (${percentage}%)
          </p>

          <p>
            🔓 Nivel A2 desbloqueado
          </p>

          <p>
            ⭐ +200 XP
            <br>
            🪙 +100 monedas
          </p>

          <br>

          <button
            class="btn gold"
            onclick="closeModal();go('levels')">
            🚀 Continuar
          </button>

        </div>

      `
    );

  }else{

    showModal(
      "📚 Examen no aprobado",
      `

        <div style="text-align:center">

          <h2>
            ${examCorrect}/20
          </h2>

          <p>
            Necesitas al menos 14 respuestas correctas.
          </p>

          <br>

          <button
            class="btn"
            onclick="startA1Exam()">
            🔄 Repetir examen
          </button>

          <button
            class="btn secondary"
            onclick="closeModal()">
            Salir
          </button>

        </div>

      `
    );

  }

}

/* =========================
   INICIO FINAL
========================= */

applyTheme();
setupCategories();
updateStats();
renderLevels();
renderLessons();
renderWords();
renderPhrases();
renderQuiz();
renderListening();
renderWriting();
renderAchievements();
renderProfile();
renderShop();
renderInventory();
renderMissions();
renderCalendar();
renderCollection();
renderReview();

saveState();

