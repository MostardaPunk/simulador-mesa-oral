import OpenAI from "openai";
import {NextResponse} from "next/server";
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});

export async function POST(req:Request){
  const {up,professor="random"}=await req.json();
  const personality = professor==="random"
    ? "Escolha aleatoriamente um examinador: acolhedor, neutro ou exigente. Mude apenas o estilo, não o rigor científico."
    : professor;
  const prompt=`Você é um examinador de mesa oral de Crecimiento y Desarrollo da UNR. Estamos na UP ${up}.
${personality}
Faça UMA pergunta oral em espanhol, clara e curta, que exija explicação e fundamentação. Não invente títulos ou conteúdos específicos de uma UP que não estejam no contexto fornecido. Como ainda não carregamos a guia oficial, faça uma pergunta geral sobre crecimiento y desarrollo e marque que o conteúdo oficial será conectado depois.
Retorne somente a pergunta.`;
  const r=await client.responses.create({model:"gpt-5-mini",input:prompt});
  const question=r.output_text.trim();
  const audio=await client.audio.speech.create({model:"gpt-4o-mini-tts",voice:"alloy",input:question,format:"mp3"});
  const b=Buffer.from(await audio.arrayBuffer()).toString("base64");
  return NextResponse.json({question,audio:`data:audio/mpeg;base64,${b}`});
}