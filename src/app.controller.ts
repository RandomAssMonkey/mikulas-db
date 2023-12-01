/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as mysql from 'mysql2'
import { UjgyerekDto } from './ujgyerek.dto';

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mikulas'
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    /*const eredmeny = await conn.execute('SELECT id, nev, jo, ajandek FROM gyerekek');
    const adatok = eredmeny[0];
    const mezok = eredmeny[1];*/
    const [adatok, mezok] = await conn.execute('SELECT id, nev, jo, ajandek FROM gyerekek');
    console.log(adatok);
    return {gyerekek: adatok,};
  }

  @Get('/gyerekek/:id')
  @Render('gyerek')
  async egyGyerek(@Param('id') id:number){
   const [adatok] = await conn.execute('SELECT id, nev, jo, ajandek FROM gyerekek WHERE id = ?', [id]);
   return adatok[0];
  }

@Get('/ujGYerek')
@Render('ujgyerek')
ujGyerekForm(){
  //...
}

  @Post('/ujGyerek')
  async ujGyerek(@Body() ujgyerek: UjgyerekDto){
    const nev = ujgyerek.nev;
    const jo: boolean = ujgyerek.jo == '1';
    const ajandek = jo ? ujgyerek.ajandek : null;
    const [adatok] = await conn.execute("INSERT INTO gyerekek (nev, jo, ajandek) VALUES (?, ?, ?)", 
    [nev, jo, ajandek]);
    return {};
  }
}
