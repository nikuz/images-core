const fs = require('fs');
const puppeteer = require('puppeteer');

const windowSet = (page, name, value) => page.evaluateOnNewDocument(`
    Object.defineProperty(window, '${name}', {
        get() {
            return '${value}'
        }
    })
`);

(async () => {
    const startTime = Date.now();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 600,
        height: 600,
    });
    await windowSet(page, 'puppeteer', true);

    await page.title().then(title => {
        console.log(title);
    });

    let frame = 1;
    const base64Reg = /^data:image\/(jpeg|png);base64,/;
    page.on('console', async (msg) => {
        const text = msg.text();
        // console.log(text.substring(0, 100));
        if (text === 'puppeteer: Finish') {
            console.log('Puppeteer total time: ', (Date.now() - startTime) / 1000);
            await browser.close();
        } else {
            const imageFormat = base64Reg.exec(text);
            if (imageFormat && imageFormat[1]) {
                const base64Data = msg.text().replace(base64Reg, '');
                let frameId = frame;
                if (frame < 10) {
                    frameId = `00${frame}`;
                } else if (frame < 100) {
                    frameId = `0${frame}`;
                }
                fs.writeFile(`./dst/out/${frameId}.${imageFormat[1]}`, base64Data, 'base64', err => {
                    if (err) {
                        console.log(err);
                    }
                    frame++;
                });
            }
        }
    });

    if (!fs.existsSync('./dst')){
        fs.mkdirSync('./dst');
        if (!fs.existsSync('./dst/out')){
            fs.mkdirSync('./dst/out');
        }
    }

    await page.goto('http://localhost:9000', {
        waitUntil: 'domcontentloaded'
    });
})();
