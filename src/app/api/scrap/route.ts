import Chromium from "@sparticuz/chromium-min";
import { NextResponse, NextRequest } from "next/server";
import puppeteer from "puppeteer-core";

const chromiumPack = 'https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar'

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
            '--window-size=1920x1080'
          ],
        });
        const page = await browser.newPage();

        await new Promise(resolve => setTimeout(resolve, 1000));


        await page.goto('http://bianca.com', {waitUntil: 'networkidle2', timeout: 100000});
    
        await page.waitForSelector('body');
    
        const content = await page.content();
    
        await browser.close();
    
        return NextResponse.json({ content });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao fazer scraping' }, { status: 500 })
      }


}