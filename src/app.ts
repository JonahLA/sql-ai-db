import OpenAI from 'openai'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { query } from './db'

const client = new OpenAI({
    apiKey: process.env['OPENAPI_API_KEY']
})

async function getChatGptResponse(promptContent: string): Promise<string> {
    const stream = await client.chat.completions.create({
        messages: [{ role: 'user', content: promptContent }],
        model: 'gpt-4o-mini',
        stream: true
    })

    let response = ''
    for await (const chunk of stream) {
        response += chunk.choices[0]?.delta?.content || ''
    }
    return response
}

function parseSql(response: string): string {
    const SQL_START = '```mysql'
    const SQL_END = '```'

    let result = response
    if (result.includes(SQL_START)) result = result.split(SQL_START)[1]
    if (result.includes(SQL_END)) result = result.split(SQL_END)[0]
    return result
}

function formatQueryResults(results: any[]): string {
    return results.map(row => {
        return Object.values(row).join(', ')
    }).join('\n')
}

async function executeSqlQuery(sql: string): Promise<string> {
    const rawQueryResults = await query(sql)
    let formattedResults = ''

    if (Array.isArray(rawQueryResults)) {
        formattedResults = formatQueryResults(rawQueryResults)
    } else {
        formattedResults = rawQueryResults.toString()
    }

    return formattedResults
}

const setupSqlScript: string = '```mysql' + readFileSync(resolve(__dirname, '../docker/db/setup/01_create-tables.sql'), 'utf-8') + '```'
const commonSqlOnlyRequest = 'Give me a MySQL SELECT statement that answers the question below for the tables provided above. Only respond with MySQL syntax. If there is an error, do not explain it!'
const examples: { [key: number]: string } = {
    1: 'What items has Jonah tried? ' +
       '```mysql\nSELECT ti.* FROM TriedItem ti JOIN User u ON ti.user_id = u.id WHERE u.first_name = \'Jonah\';\n```',
}
const strategies: { [key: string]: string } = {
    'zero-shot': `${setupSqlScript} ${commonSqlOnlyRequest}`,
    'single-domain_single-shot': `${setupSqlScript} Example: ${examples[1]} ${commonSqlOnlyRequest}`
}
const questions = [
    'What items has Gianna tried?',
    'What location(s) has/have been tried the most?',
    'What is the average price of items tried from Walmart?'
]

async function main() {
    const question = questions[0]
    const strategy = strategies['zero-shot']

    // === GENERATE SQL QUERY ===
    const sqlResponse = await getChatGptResponse(`${strategy} ${question}`)
    const parsedSqlResponse = parseSql(sqlResponse)

    // === RUN SQL QUERY ===
    let queryResult = undefined
    let queryError = undefined
    try {
        queryResult = await executeSqlQuery(parsedSqlResponse)
    } catch (error) {
        console.error(error)
        queryError = error
    }

    // === GENERATE NATURAL LANGUAGE RESPONSE ===
    if (queryResult) {
        let friendlyResponsePrompt = `I asked a question ${question} and the response from my database was \`\`\`${queryResult}\`\`\`. Can you interpret the data in the response so you can answer my question in a friendly way? Please do not give any other suggestions or chatter.`
        let friendlyResponse = await getChatGptResponse(friendlyResponsePrompt)
        console.log(friendlyResponse)
    }
}

main()
