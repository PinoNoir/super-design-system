import fs from 'fs-extra';
import path from 'path';

export async function copyTemplate(
  templatePath: string,
  targetPath: string,
  replacements: Record<string, string> = {}
): Promise<void> {
  await fs.ensureDir(targetPath);
  await fs.copy(templatePath, targetPath);

  // Process template files and replace placeholders
  if (Object.keys(replacements).length > 0) {
    await processTemplateFiles(targetPath, replacements);
  }
}

async function processTemplateFiles(
  dir: string,
  replacements: Record<string, string>
): Promise<void> {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      await processTemplateFiles(filePath, replacements);
    } else if (stat.isFile() && shouldProcessFile(file)) {
      let content = await fs.readFile(filePath, 'utf-8');

      // Replace all placeholders
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, value);
      }

      await fs.writeFile(filePath, content, 'utf-8');
    }
  }
}

function shouldProcessFile(fileName: string): boolean {
  const processableExtensions = [
    '.js', '.jsx', '.ts', '.tsx',
    '.json', '.md', '.html', '.css',
    '.scss', '.sass', '.yml', '.yaml'
  ];

  return processableExtensions.some(ext => fileName.endsWith(ext));
}

export async function writeJsonFile(
  filePath: string,
  data: object
): Promise<void> {
  await fs.writeJson(filePath, data, { spaces: 2 });
}

export async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}
