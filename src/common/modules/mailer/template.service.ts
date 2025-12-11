import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

@Injectable()
export default class TempalteService {
  private handlebars: typeof Handlebars;

  constructor() {
    this.handlebars = Handlebars;
    this.registerHelper('eq', (a, b) => a === b);
  }

  async load<T>(name: string, data?: T): Promise<string> {
    const textContent = await readFile(
      join(__dirname, '../../../..', 'templates', name + '.html'),
      'utf-8',
    );
    const templateBuilder = this.handlebars.compile(textContent);
    return templateBuilder(data);
  }

  private registerHelper(name: string, fn: Handlebars.HelperDelegate) {
    this.handlebars.registerHelper(name, fn);
  }
}
