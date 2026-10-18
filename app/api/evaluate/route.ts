import OpenAI from "openai";
import {NextResponse} from "next/server";
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});

export async function POST(req:Request){
  const form=await req.formData();
  const file=form.get("audio") as File;
  const up=String(form.get("up"));
  if(!file) return NextResponse.json({error:"Áudio ausente"},{status:400});

  const tr=await client.audio.transcriptions.create({model:"gpt-4o-mini-transcribe",file});
  const transcript=tr.text;

  const prompt=`Você é um examinador universitário rigoroso de Crecimiento y Desarrollo da UNR.
UP: ${up}
Resposta oral transcrita do aluno:
"${transcript}"

Avalie SOMENTE o que pode ser sustentado pela resposta. Não invente critérios específicos da UP que não estejam disponíveis.
Dê nota de 0 a 10 considerando: conhecimento científico, fundamentación, completitud, clareza e vocabulário técnico.
Se o espanhol tiver erros mas o conceito estiver correto, não penalize excessivamente.
Se a resposta for vaga, peça exatamente o que faltou.
Retorne JSON válido com:
{"score":number,"feedback":"texto em espanhol, objetivo e rigoroso","strengths":["..."],"missing":["..."],"next_question_hint":"..."}`;
  const r=await client.responses.create({model:"gpt-5-mini",input:prompt});
  let parsed:any;
  try{ parsed=JSON.parse(r.output_text); }catch{ parsed={score:0,feedback:r.output_text,strengths:[],missing:[],next_question_hint:""}}
  return NextResponse.json({...parsed,transcript});
}