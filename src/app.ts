import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: process.env['OPENAPI_API_KEY']
})

async function main() {
    const stream = await client.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-4o-mini',
        stream: true
    })

    let response = '';
    for await (const chunk of stream) {
        response += chunk.choices[0]?.delta?.content || ''
    }
    console.log(response)
}

main()
