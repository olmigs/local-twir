import * as fs from 'fs';
import colors from 'colors';
import Parser from 'rss-parser';

// global constants
colors.setTheme({
    feed: 'green',
    title: 'red',
    article: 'cyan',
    link: 'yellow',
    success: 'bgGreen',
    error: 'bgRed',
    warn: 'magenta',
});
const url = 'https://this-week-in-rust.org/rss.xml';
// global variables
let parser = new Parser({
    customFields: {
        item: [['content:encoded', 'content', { includeSnippet: true }]],
    },
});

// main
parser.parseURL(url).then((feed) => {
    log(colors.feed.bold('\n' + feed.title));
    if (feed.lastBuildDate) {
        log(colors.article(feed.lastBuildDate) + '\n');
    }
    handleTWIR(feed.items[0]);
});

// methods

/**
 * @param {Parser.Item} item
 */
function handleTWIR(item, date) {
    const today = getDay();
    let logStr = `Well, today is ${colors.warn.bold(today)}, `;
    const todate = new Date();
    const pub = new Date(item.pubDate);
    const daysAgo = Math.floor((todate.getTime() - pub.getTime()) / 86400000);
    logStr += `and ${colors.feed.bold(
        'TWiR'
    )} was updated ${colors.warn.bold(daysAgo + ' day(s) ago')},\n\n`;
    if (daysAgo > 4) {
        logStr += 'but you can still ';
    } else {
        logStr += 'so you should ';
    }
    logStr += `read ${colors.article.bold(item.title)} at ${colors.link(
        item.link
    )}\n\n    or call ${colors.green(
        'yarn local-twir'
    )} to view at ${colors.link('http://localhost:6969/')}.`;
    let html = `<h1>` + item.title + '</h1>';
    html += '<p><strong>published ' + item.pubDate + '</strong></p>';
    fs.writeFileSync('twir/head.html', html);
    fs.writeFileSync('twir/twir.html', item.content);
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

/**
 * Wrapper around `console.log`.
 *
 * @param {string} msg
 */
function log(msg) {
    console.log(msg);
}
