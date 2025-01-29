import OpenAI from 'openai'
import { readFileSync, writeFileSync } from 'node:fs'
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
    'What is the name/are the names of the location(s) that has/have been tried the most?',
    'What is the average price of items tried from Walmart?',
    'What life missions does Anne have?',
    'What is the most popular life mission?',
    'Which location serves the item with the highest cost?',
    'Which location serves the items with the lowest rating on average?',
    'What is the average rating of items from Walmart?'
]
const strategiesList = [
    'zero-shot',
    'single-domain_single-shot'
]

async function main() {
    let strategyResults: { [key: string]: any } = {}

    for (const strategyName of strategiesList) {
        let questionResults: any[] = []

        await Promise.all(questions.map(async question => {
            const strategy = strategies[strategyName]
            console.log('\t---')

            // === GENERATE SQL QUERY ===
            const sqlResponse = await getChatGptResponse(`${strategy} ${question}`)
            const parsedSqlResponse = parseSql(sqlResponse)
            console.log('\t', parsedSqlResponse)
        
            // === RUN SQL QUERY ===
            let queryResult = undefined
            let queryError = undefined
            try {
                queryResult = await executeSqlQuery(parsedSqlResponse)
                console.log('\t', queryResult)
            } catch (error) {
                console.error('\t', error)
                queryError = error
            }
        
            // === GENERATE NATURAL LANGUAGE RESPONSE ===
            let friendlyResponse = undefined
            if (queryResult) {
                let friendlyResponsePrompt = `I asked a question ${question} and the response from my database was \`\`\`${queryResult}\`\`\`. Can you interpret the data in the response so you can answer my question in a friendly way? Please do not give any other suggestions or chatter.`
                friendlyResponse = await getChatGptResponse(friendlyResponsePrompt)
                console.log('\t', friendlyResponse)
            }

            questionResults.push({
                'question': question,
                'sql': parsedSqlResponse,
                'queryResult': queryResult,
                'friendlyResponse': friendlyResponse,
                'error': queryError
            })
        }))

        strategyResults[strategyName] = questionResults
    }

    const time = new Date().toISOString().replace(/[:.]/g, '-')
    const outputPath = resolve(__dirname, `../out/results_${time}.json`)

    writeFileSync(outputPath, JSON.stringify(strategyResults, null, 2))
    console.log(`Results written to ${outputPath}`)
}

main()
