const CASE={culprit:"Arjun Rao",evidence:[
{id:"receipt",title:"Cafe receipt",text:"Arjun's card paid at the lobby cafe at 11:31 PM."},
{id:"camera",title:"Lift camera gap",text:"Camera 2 stopped recording between 11:38 and 11:46 PM."},
{id:"key",title:"Spare key",text:"A spare key for 804 was signed out at 11:36 PM."},
{id:"message",title:"Deleted message",text:"Recovered notification: “Meet me upstairs. Bring the drive.”"},
{id:"fiber",title:"Blue jacket fiber",text:"A blue fiber was found beside the desk."}],
suspects:[
{name:"Arjun Rao",role:"Product engineer",avatar:"AR",mood:68,secret:"He needed the prototype before morning.",tags:["drive","key","11:42","upstairs"]},
{name:"Meera Shah",role:"Neighbor",avatar:"MS",mood:43,secret:"She heard someone arguing upstairs.",tags:["argument","corridor","camera"]},
{name:"Kabir Singh",role:"Building manager",avatar:"KS",mood:56,secret:"He knows about the camera outage.",tags:["camera","lift","outage"]},
{name:"Nisha Varma",role:"Founder",avatar:"NV",mood:78,secret:"She wanted the prototype secured.",tags:["prototype","founder","drive"]},
{name:"Vikram Iyer",role:"Investor",avatar:"VI",mood:31,secret:"He was waiting downstairs for a meeting.",tags:["lobby","cafe","meeting"]}]};

let selected=null,questions=0,score=0,collected=new Set(),seconds=900,ended=false;
const $=id=>document.getElementById(id);
function renderSuspects(){
 $("suspects").innerHTML=CASE.suspects.map((s,i)=>`<button class="suspect ${s===selected?"active":""}" data-i="${i}"><div class="avatar">${s.avatar}</div><div><strong>${s.name}</strong><span>${s.role}</span><div class="mood" title="composure"><i style="--mood:${s.mood}%"></i></div></div></button>`).join("");
 document.querySelectorAll(".suspect").forEach(b=>b.onclick=()=>selectSuspect(CASE.suspects[+b.dataset.i]));
}
function selectSuspect(s){selected=s;renderSuspects();$("interviewMeta").textContent=s.name+" · "+s.role;$("chat").innerHTML="";addBubble("system",s.name+" enters the room. The recorder starts.");renderQuick();}
function renderQuick(){
 $("quickQuestions").innerHTML=["Where were you at 11:42 PM?","Tell me about the missing drive.","Did you have a key to 804?","What do you know about the lift camera?"].map(q=>`<button data-q="${q}">${q}</button>`).join("");
 document.querySelectorAll(".quick button").forEach(b=>b.onclick=()=>respond(b.dataset.q));
}
function addBubble(type,text){
 const el=document.createElement("div");el.className="bubble "+type;
 if(type==="npc")el.innerHTML='<span class="speaker">'+selected.name.toUpperCase()+'</span>'+escapeHtml(text);else el.textContent=text;
 $("chat").appendChild(el);$("chat").scrollTop=$("chat").scrollHeight;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function typing(){
 const el=document.createElement("div");el.className="bubble npc typing";el.id="typing";el.innerHTML='<i></i><i></i><i></i>';$("chat").appendChild(el);$("chat").scrollTop=$("chat").scrollHeight;
}
function reveal(id){if(collected.has(id))return;const e=CASE.evidence.find(x=>x.id===id);collected.add(id);$("evidenceCount").textContent=collected.size;score+=15;$("score").textContent=score;const empty=document.querySelector(".empty-evidence");if(empty)empty.remove();const d=document.createElement("div");d.className="evidence-item";d.innerHTML='<strong>'+e.title+'</strong><span>'+e.text+'</span>';$("evidenceBoard").appendChild(d)}
function respond(q){
 if(!selected||ended)return;
 questions++;$("questions").textContent=questions;addBubble("player",q);typing();
 const text=q.toLowerCase();let answer="";
 if(text.includes("where")||text.includes("11:42")||text.includes("time")){answer=selected.name==="Arjun Rao"?"I was in the lobby cafe. I left around 11:35. After that, I went home.":selected.name==="Meera Shah"?"I was near my apartment. I heard a loud argument upstairs.":"I was where I told you. Nothing unusual happened.";if(selected.name==="Arjun Rao")reveal("receipt")}
 else if(text.includes("drive")||text.includes("prototype")){answer=selected.name==="Arjun Rao"?"I knew about the drive, but I didn't take it.":selected.name==="Nisha Varma"?"The prototype belongs to the company. I wanted it secured.":"I only heard that something valuable went missing.";if(selected.name==="Arjun Rao")reveal("message")}
 else if(text.includes("key")||text.includes("access")||text.includes("804")){answer=selected.name==="Arjun Rao"?"I never had a key to 804.":"Only the manager and residents should have access.";if(selected.name==="Arjun Rao")reveal("key")}
 else if(text.includes("camera")||text.includes("lift")){answer=selected.name==="Kabir Singh"?"The lift camera had a gap. It was a maintenance issue.":selected.name==="Arjun Rao"?"I didn't know the camera was down.":"I saw nothing from the camera.";reveal("camera")}
 else if(text.includes("jacket")||text.includes("fiber")||text.includes("clothes")){answer=selected.name==="Arjun Rao"?"Blue? Lots of people wear blue.":"I don't know anything about a fiber.";reveal("fiber")}
 else answer=selected.secret+" I don't have anything else to add.";
 setTimeout(()=>{const t=$("typing");if(t)t.remove();addBubble("npc",answer)},650+Math.random()*500);
}
function tick(){if(ended)return;seconds--;const m=String(Math.floor(seconds/60)).padStart(2,"0"),s=String(seconds%60).padStart(2,"0");$("timer").textContent=m+":"+s;if(seconds<=0){ended=true;finish(false,"Time ran out. The case went cold.")}}
function finish(correct,text){ended=true;if(correct){score+=50;$("score").textContent=score;$("resultIcon").textContent="✓";$("resultTitle").textContent="Case solved.";$("resultText").textContent=text}else{$("resultIcon").textContent="×";$("resultTitle").textContent="Investigation failed.";$("resultText").textContent=text}$("resultDialog").showModal()}
$("askBtn").onclick=()=>{const q=$("questionInput").value.trim();if(q){$("questionInput").value="";respond(q)}};$("questionInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("askBtn").click()});
$("accuseBtn").onclick=()=>{if(!selected)return;const chosen=$("accuseSelect").value;finish(chosen===CASE.culprit,chosen===CASE.culprit?"You connected the spare key, camera gap, deleted message and blue fiber to Arjun Rao.":"Your accusation was "+chosen+". The evidence points somewhere else — keep questioning.)"};
$("closeResult").onclick=()=>{$("resultDialog").close();ended=false};
$("accuseSelect").innerHTML=CASE.suspects.map(s=>'<option>'+s.name+'</option>').join("");
renderSuspects();renderQuick();setInterval(tick,1000);