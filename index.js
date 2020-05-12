const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const scrapeRes = [{
    name: 'String',
    position: 'String',
    team: 'String',
    salary: 'Number',
    profileUrl: 'String'
}];

async function scrapeSalaryList() {
    const res = await request.get(
        "https://www.pro-football-reference.com/players/salary.htm"
    );
    fs.writeFileSync('./test.html', res);
    
    const $ = await cheerio.load(res);
    const data = [];

    $('#player_salaries > tbody > tr').each((i, el) => {
        // console.log($(el).find('td:nth-child(2) > a'));

        const nameEl = $(el).find('td:nth-child(2) > a');
        const posEl = $(el).find('td:nth-child(3)');
        const teamEl = $(el).find('td:nth-child(4) > a');
        const salaryEl = $(el).find('td.right');

        const name = $(nameEl).text();
        const pos = $(posEl).text();
        const team = $(teamEl).text();
        const salary = $(salaryEl).text();
        const profileUrl = 'https://www.pro-football-reference.com' + $(nameEl).attr('href');

        const dataRow = {
            name,
            pos,
            team,
            salary,
            profileUrl
        }
        data.push(dataRow);
    })
    writeFile(data)
}
scrapeSalaryList()

// CUSTOM WRITEFILE
async function writeFile(data) {
    fs.writeFile('./data.json', JSON.stringify(data, null, 4), (err) => {
        console.log('Write-file success');
    });
};