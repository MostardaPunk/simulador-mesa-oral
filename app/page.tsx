 "use client";
import {useRef,useState} from "react";

const ups = Array.from({length:12},(_,i)=>({id:i+1,name:`UP ${i+1}`}));

export default function Home(){
  const [up,setUp]=useState<number|null>(null);
  const [question,setQuestion]=useState("");
  const [loading,setLoading]=useState(false);
  const [recording,setRecording]=useState(false);
  const [result,setResult]=useState<any>(null);
  const rec=useRef<MediaRecorder|null>(null);
  const chunks=useRef<Blob[]>([]);

  async function start(upId:number){
    setUp(upId); setResult(null); setLoading(true);
    const r=await fetch("/api/question",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({up:upId,professor:"random",language:"es"})});
    const d=await r.json(); setQuestion(d.question || "No fue posible generar la pregunta.");
    if(d.audio){ const a=new Audio(d.audio); a.play().catch(()=>{}); }
    setLoading(false);
  }
  async function record(){
    if(recording){rec.current?.stop(); setRecording(false); return;}
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    chunks.current=[];
    const r=new MediaRecorder(stream);
    rec.current=r;
    r.ondataavailable=e=>chunks.current.push(e.data);
    r.onstop=async()=>{
      stream.getTracks().forEach(t=>t.stop());
      const blob=new Blob(chunks.current,{type:"audio/webm"});
      const fd=new FormData(); fd.append("audio",blob,"answer.webm"); fd.append("up",String(up));
      setLoading(true);
      const res=await fetch("/api/evaluate",{method:"POST",body:fd});
      const d=await res.json(); setResult(d); setLoading(false);
    };
    r.start(); setRecording(true);
  }
  return <main className="wrap">
    <div className="top"><div><h1>🎓 Mesa Oral UNR</h1><div className="muted">Crecimiento y Desarrollo · simulador oral</div></div>
      {up && <button className="select" onClick={()=>{setUp(null);setResult(null)}}>Cambiar UP</button>}</div>

    {!up ? <><h2>Elegí una UP</h2><p className="muted">A versão inicial deixa as 12 UPs prontas para receber o conteúdo oficial da sua guia.</p>
      <div className="grid">{ups.map(x=><button key={x.id} className="card" onClick={()=>start(x.id)} style={{color:"inherit",textAlign:"left"}}><span className="pill">UP {x.id}</span><h3>Entrenamiento oral</h3><p className="muted">Perguntas, resposta por voz e correção por IA.</p></button>)}</div>
    </> :
    <section className="oral">
      <span className="pill">UP {up}</span><h2>Simulación de mesa</h2>
      <div className="q">{loading && !question ? "Preparando la pregunta..." : question}</div>
      <p className="muted">Respondé en voz alta. O examinador avaliará conhecimento, fundamentación, completitud e linguagem técnica.</p>
      <div className="row"><button className={"mic "+(recording?"recording":"")} onClick={record}>{recording?"⏹":"🎙️"}</button><span>{recording?"Grabando... tocá para terminar":"Tocá para responder"}</span></div>
      {result && <div className="card" style={{marginTop:22}}><div className="score">{result.score}/10</div>
        <h3>Evaluación</h3><div className="feedback">{result.feedback}</div>
        {result.transcript && <><h3>Tu respuesta</h3><div className="feedback">{result.transcript}</div></>}
        <button className="select" onClick={()=>start(up!)}>Siguiente pregunta</button>
      </div>}
    </section>}
  </main>
}