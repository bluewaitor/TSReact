import * as path from 'path';
import * as fs from 'fs';

const yaml = require('yaml');

interface Snippet {
  name: string;
  prefix: string;
  body: string[];
  description?: string;
  scope?: string;
  file?: string;
}

function getAllFiles(folder: string) {
  const result: string[] = [];

  fs.readdirSync(folder).forEach((file) => {
    const name = path.join(folder, file);
    const isDirectory = fs.statSync(name).isDirectory();

    if (isDirectory) {
      result.push(...getAllFiles(name));
    } else {
      result.push(name);
    }
  }, []);

  return result;
}

const folder = './snippets';
const snippets: Array<Snippet> = [];

getAllFiles(folder).map((filePath) => {
  const file = fs.readFileSync(filePath, 'utf-8');
  const doc = yaml.parse(file);

  Object.entries(doc).map(([key, value]: [string, { prefix: string, tpl: string, desc: string, scope: string }]) => {
    if (!value.prefix) {
      throw new Error('prefix is required');
    }

    if (!value.tpl) {
      throw new Error('tpl is required');
    }

    snippets.push({
      name: key,
      prefix: value.prefix,
      description: value.desc,
      body: value.tpl.split('\n').map((line) => {
        return line;
      }),
      scope: value.scope,
      file: filePath,
    });
  });
});

const json = {};

snippets.forEach((snippet) => {
  const { file, ...others } = snippet;

  json[snippet.name] = others;
});

fs.writeFileSync('./vscode/snippets/snippets.json', JSON.stringify(json, undefined, 2));
