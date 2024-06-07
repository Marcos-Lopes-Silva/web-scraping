import Chromium from "@sparticuz/chromium-min";
import { NextResponse, NextRequest } from "next/server";
import puppeteer from "puppeteer-core";

const chromiumPack = 'https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar'

export async function GET(req: NextRequest) {
  
    try {
        const executablePath = await Chromium.executablePath(chromiumPack);
        const browser = await puppeteer.launch({
          headless: true,
          executablePath: executablePath,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--single-process',
            '--no-zygote',
            '--window-size=1920x1080'
          ],
          ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();

        await new Promise(resolve => setTimeout(resolve, 1000));


        await page.goto('http://bianca.com', {waitUntil: 'networkidle2', timeout: 100000});
    
        await page.waitForSelector('body');
        
        const title = await page.title();
        const body = await page.evaluate(() => {
            return document.body.innerHTML;
          });
        const content = await page.content();
        
        await browser.close();
        const data = {
            content,
            title,
            body
        }
        return NextResponse.json({ data });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao fazer scraping' }, { status: 500 })
      }


}