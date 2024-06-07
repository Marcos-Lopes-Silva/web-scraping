import { NextResponse, NextRequest } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: NextRequest) {
    try {
        const browser = await puppeteer.launch({
          headless: true,
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

        await page.goto('http://bianca.com', {waitUntil: 'networkidle2', timeout: 10000});
    
        await page.waitForSelector('body');
    
        const content = await page.content();
    
        await browser.close();
    
        return NextResponse.json({ content });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao fazer scraping' }, { status: 500 })
      }


}