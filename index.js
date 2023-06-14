import fetch from "node-fetch";
import prompt from "prompt-sync";
import * as dotenv from "dotenv";
dotenv.config();
const prmt = prompt({ sigint: true });

//3 roles system, user, or assistant
const historialMensajes= [{ role: 'system', content: 'eres un asistente virtual' }];

// promise
const botAnswer = async (input) => {
    historialMensajes.push({ role: 'user', content: input });
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: historialMensajes,
            temperature: 0.1,
        }),
    });
    if (!response.ok) {
        const error = await response.json();
        // log posible error 
        console.error('OpenAI API Error:', error);
        return error;
    }
    //extraemos respuesta
    const objRespuesta = await response.json();
    const contenidoRespuesta = objRespuesta.choices[0].message.content;
    //agregamos respuesta al historial
    historialMensajes.push({role: 'assistant', content: contenidoRespuesta});
    
    return contenidoRespuesta;
};

console.log('Bienvenido a tu asistente virtual, puedes realizarme cualquier pregunta!');
//Principal
while (true) {
    const input = prmt('Tu: ');
    const respuesta = await botAnswer(input);
    console.log('bot: ' + respuesta);
}