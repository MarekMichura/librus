import { Router, Request, Response } from "express";
import puppeteer from "puppeteer";

const getContent = async (req: Request, res: Response) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto('https://zstio.edu.pl/plan/u/podzgodz/index.php', { waitUntil: 'networkidle2' });

  await page.select('select', "C060DE4793092D8E");
  await page.waitForNetworkIdle();

  const data = await page.evaluate(() => {
    const elements = document.querySelectorAll<HTMLDivElement>("td");
    const element = document.querySelector("h2")?.innerText
    if (element == undefined) throw new Error('something terrible happened')
    const array = Array.from(elements).map(el => el.innerText)
    array.push(element);
    return array;
  });

  res.json(data);
  await browser.close();
};

const router = Router()
router.get("/", getContent);
module.exports = router;