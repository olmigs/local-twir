import * as fs from 'fs';
import chalk from 'chalk';
import Parser from 'rss-parser';

// global constants
const log = console.log;
const url = 'https://this-week-in-rust.org/rss.xml';
// global variables
let parser = new Parser({
    customFields: {
        item: [['content:encoded', 'content', { includeSnippet: true }]],
    },
});

// main
parser.parseURL(url).then((feed) => {
    log(chalk.green.bold('\n' + feed.title));
    if (feed.lastBuildDate) {
        log(chalk.cyan(feed.lastBuildDate) + '\n');
    }
    handleTWIR(feed.items[0]);
});

// methods

/**
 * @param {Parser.Item} item
 */
function handleTWIR(item) {
    const today = getDay();
    let logStr = `Well, today is ${chalk.magenta.bold(today)}, `;
    const todate = new Date();
    const pub = new Date(item.pubDate);
    const daysAgo = Math.floor((todate.getTime() - pub.getTime()) / 86400000);
    logStr += `and ${chalk.green.bold('TWiR')} was updated ${chalk.magenta.bold(
        daysAgo + ' day(s) ago'
    )},\n\n`;
    const tooLate = daysAgo > 4;
    if (tooLate) {
        logStr += 'but you can still ';
    } else {
        logStr += 'so you should ';
    }
    logStr += `read ${chalk.cyan.bold(item.title)} at ${chalk.yellow(
        item.link
    )}\n\n    or call ${chalk.green(
        'yarn local-twir'
    )} to view at ${chalk.yellow('http://localhost:6969/')}.`;
    if (!tooLate) {
        let html = `<h1>` + item.title + '</h1>';
        html += '<p><strong>published ' + item.pubDate + '</strong></p>';
        fs.writeFileSync('public/head.html', html);
        fs.writeFileSync('public/twir.html', item.content);
        
    }
    log(logStr + '\n');
}

/**
 * @returns {string} Today.
 */
function getDay() {
    const date = new Date();
    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    return days[date.getDay()];
}
