import OpenAI from "openai";
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
export async function POST(req:Request){
 const {text}=await req.json();
 const audio=await client.audio.speech.create({model:"gpt-4o-mini-tts",voice:"alloy",input:text,format:"mp3"});
 return new Response(await audio.arrayBuffer(),{headers:{"Content-Type":"audio/mpeg"}});
}