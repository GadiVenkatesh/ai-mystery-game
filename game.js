const CASE={culprit:"Arjun Rao",evidence:[
  {id:"receipt",title:"Cafe receipt",text:"Arjun's card paid at the lobby cafe at 11:31 PM."},
  {id:"camera",title:"Lift camera gap",text:"Camera 2 stopped recording between 11:38 and 11:46 PM."},
  {id:"key",title:"Spare key",text:"A spare key for Apartment 804 was signed out at 11:36 PM."},
  {id:"message",title:"Deleted message",text:"A recovered notification says: “Meet me upstairs. Bring the drive.”"},
  {id:"fiber",title:"Blue fiber",text:"A blue jacket fiber was found near the desk where the drive was stored."}
],suspects:[
  {name:"Arjun Rao",role:"Product engineer",secret:"He had a spare key and needed the prototype.",tags:["drive","key","11:42","upstairs"]},
  {name:"Meera Shah",role:"Neighbor",secret:"She heard someone arguing in the corridor.",tags:["argument","corridor","camera"]},
  {name:"Kabir Singh",role:"Building manager",secret:"He knows about the camera outage.",tags:["camera","lift","outage"]},
  {name:"Nisha Varma",role:"Founder",secret:"She wanted the prototype back before morning.",tags:["prototype","founder","drive"]},
  {name:"Vikram Iyer",role:"Investor",secret:"He was waiting downstairs for a meeting.",tags:["lobby","cafe","meeting"]}
]};

let selected=CASE.suspects[0],questions=0,score=0,collected=new Set();

const $=id=>document.getElementById(id);
function renderSuspects(){
  $("suspects").innerHTML=CASE.suspects.map((s,i)=>`<button class="suspect ${s===selected?"active":""}" data-i="${i}"><strong>${s.name}</strong><span>${s.role}</span></button>`).join("");
  document.querySelectorAll(".suspect").forEach(b=>b.onclick=()=>{selected=CASE.suspects[+b.dataset.i];renderSuspects();addBubble("system",`Interviewing ${selected.name}.`)});
  $("accuseSelect").innerHTML=CASE.suspects.map(s=>`<option>${s.name}</option>`).join("");
}
function addBubble(type,text){const el=document.createElement("div");el.className="bubble "+type;el.textContent=text;$("chat").appendChild(el);$("chat").scrollTop=$("chat").scrollHeight}
function reveal(id){if(collected.has(id))return;const e=CASE.evidence.find(x=>x.id===id);if(!e)return;collected.add(id);$("evidenceCount").textContent=collected.size;score+=15;$("score").textContent=score;const empty=document.querySelector(".empty");if(empty)empty.remove();const d=document.createElement("div");d.className="evidence-item";d.innerHTML=`<strong>${e.title}</strong><span>${e.text}</span>`;$("evidenceBoard").appendChild(d)}
function respond(q){
  const text=q.toLowerCase();questions++;$("questions").textContent=questions;
  let answer="";
  if(text.includes("where")||text.includes("11:42")||text.includes("time")){
    answer=selected.name==="Arjun Rao"?"I was in the lobby cafe. I left around 11:35. After that, I went home.":selected.name==="Meera Shah"?"I was near my apartment. I heard a loud argument upstairs.":"I was where I told you. Nothing unusual happened.";
    if(selected.name==="Arjun Rao") reveal("receipt");
  }else if(text.includes("drive")||text.includes("prototype")){
    answer=selected.name==="Arjun Rao"?"I knew about the drive, but I didn't take it.":selected.name==="Nisha Varma"?"The prototype belongs to the company. I wanted it secured.":"I only heard that something valuable went missing.";
    if(selected.name==="Arjun Rao") reveal("message");
    if(selected.name==="Nisha Varma") score+=5;
  }else if(text.includes("access")||text.includes("key")||text.includes("804")){
    answer=selected.name==="Arjun Rao"?"I never had a key to 804.":"Only the manager and residents should have access.";
    if(selected.name==="Arjun Rao") reveal("key");
  }else if(text.includes("camera")||text.includes("lift")){
    answer=selected.name==="Kabir Singh"?"The lift camera had a gap. It was a maintenance issue.":selected.name==="Arjun Rao"?"I didn't know the camera was down.":"I saw nothing from the camera.";
    reveal("camera");
  }else if(text.includes("jacket")||text.includes("fiber")||text.includes("clothes")){
    answer=selected.name==="Arjun Rao"?"Blue? Lots of people wear blue.":"I don't know anything about a fiber.";
    reveal("fiber");
  }else{
    answer=selected.secret+" I don't have anything else to add.";
  }
  addBubble("player",q);setTimeout(()=>addBubble("npc",answer),80);
}
$("askBtn").onclick=()=>{const q=$("questionInput").value.trim();if(q){$("questionInput").value="";respond(q)}};
$("questionInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("askBtn").click()});
document.querySelectorAll("#quickQuestions button").forEach(b=>b.onclick=()=>respond(b.dataset.q));
$("accuseBtn").onclick=()=>{
  const chosen=$("accuseSelect").value,correct=chosen===CASE.culprit;
  if(correct){score+=50;$("score").textContent=score;$("resultTitle").textContent="Case solved.";$("resultText").textContent="You identified Arjun Rao. The spare key, camera gap, deleted message and blue fiber connect him to the missing drive."}
  else{$("resultTitle").textContent="Wrong accusation.";$("resultText").textContent=`${chosen} was not responsible. The real culprit was ${CASE.culprit}. Review the evidence and try again.`}
  $("resultDialog").showModal();
};
$("closeResult").onclick=()=>$("resultDialog").close();
renderSuspects();