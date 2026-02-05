/**
 * Script de automação para captura de telas usando Node.js + Puppeteer
 * Alternativa ao script Python
 * 
 * Instalação:
 * npm install puppeteer
 * 
 * Execução:
 * node screenshots_automation.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class CurriculumScreenshots {
  constructor(baseUrl = 'http://localhost:3000', outputDir = 'screenshots') {
    this.baseUrl = baseUrl;
    this.outputDir = outputDir;
    this.email = 'admin@sistema.com';
    this.password = 'password123';
    this.screenshotCount = 0;
    
    // Criar diretório se não existir
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  async takeScreenshot(page, name, fullPage = true) {
    this.screenshotCount++;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
    const filename = `${String(this.screenshotCount).padStart(2, '0')}_${name}_${timestamp}.png`;
    const filepath = path.join(this.outputDir, filename);

    await page.screenshot({ path: filepath, fullPage });
    console.log(`? Screenshot salva: ${filename}`);
    return filepath;
  }

  async run() {
    const browser = await puppeteer.launch({
      headless: false, // Mostrar navegador
      args: ['--start-maximized']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      // 1?? TELA DE LOGIN
      console.log('\n?? Etapa 1: Capturando página de login...');
      await page.goto(`${this.baseUrl}/login`);
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
      await this.takeScreenshot(page, '01_login_page');

      // 2?? PREENCHER FORMULÁRIO
      console.log('\n?? Etapa 2: Preenchendo formulário de login...');
      await page.type('input[type="email"]', this.email);
      await page.type('input[type="password"]', this.password);
      await this.takeScreenshot(page, '02_login_preenchido');

      // 3?? SUBMETER LOGIN
      console.log('\n?? Etapa 3: Fazendo login...');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        page.click('button[type="submit"]')
      ]);
      await page.waitForTimeout(2000);
      await this.takeScreenshot(page, '03_dashboard_home');

      // 4?? ACESSAR USUÁRIOS
      console.log('\n?? Etapa 4: Acessando página de usuários...');
      try {
        await page.click('a:has-text("Usuários")');
      } catch (e) {
        await page.goto(`${this.baseUrl}/users`);
      }
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
      await page.waitForTimeout(1500);
      await this.takeScreenshot(page, '04_lista_usuarios');

      // 5?? ACESSAR PERFIL
      console.log('\n?? Etapa 5: Acessando perfil do usuário...');
      try {
        const profileButton = await page.$('[aria-label*="profile"], button:has-text("Perfil")');
        if (profileButton) {
          await profileButton.click();
        } else {
          await page.goto(`${this.baseUrl}/profile`);
        }
      } catch (e) {
        await page.goto(`${this.baseUrl}/profile`);
      }
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
      await page.waitForTimeout(1500);
      await this.takeScreenshot(page, '05_perfil_usuario');

      // 6?? ACESSAR CURRÍCULOS
      console.log('\n?? Etapa 6: Acessando lista de currículos...');
      try {
        await page.click('a:has-text("Currículos"), a:has-text("Meus Currículos")');
      } catch (e) {
        await page.goto(`${this.baseUrl}/resumes`);
      }
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
      await page.waitForTimeout(1500);
      await this.takeScreenshot(page, '06_lista_curriculos');

      // 7?? ABRIR CURRÍCULO
      console.log('\n?? Etapa 7: Abrindo currículo para edição...');
      try {
        const editButton = await page.$('a:has-text("Editar"), button:has-text("Editar")');
        if (editButton) {
          await editButton.click();
        } else {
          const firstResume = await page.$('a[href*="/resumes/"]');
          if (firstResume) await firstResume.click();
        }
      } catch (e) {
        console.log('Não foi possível clicar em editar');
      }
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
      await page.waitForTimeout(1500);
      await this.takeScreenshot(page, '07_edicao_curriculo');

      // 8?? ABRIR PRÉ-VISUALIZAÇÃO
      console.log('\n?? Etapa 8: Abrindo pré-visualização...');
      try {
        await page.click('button:has-text("Pré-visualizar"), button:has-text("???")');
      } catch (e) {
        try {
          await page.click('[aria-label*="preview"]');
        } catch (e2) {
          console.log('Não foi possível clicar em pré-visualizar');
        }
      }
      await page.waitForTimeout(1500);
      await this.takeScreenshot(page, '08_preview_modal');

      // 9?? OPÇÃO 1
      console.log('\n?? Etapa 9: Visualizando Opção 1 (com sidebar)...');
      try {
        await page.click('button:has-text("Opção 1")');
      } catch (e) {
        console.log('Botão Opção 1 não encontrado');
      }
      await page.waitForTimeout(1000);
      await this.takeScreenshot(page, '09_preview_opcao1_sidebar');

      // ?? OPÇÃO 2
      console.log('\n?? Etapa 10: Visualizando Opção 2 (sem sidebar)...');
      try {
        await page.click('button:has-text("Opção 2")');
      } catch (e) {
        console.log('Botão Opção 2 não encontrado');
      }
      await page.waitForTimeout(1000);
      await this.takeScreenshot(page, '10_preview_opcao2_fullwidth');

      // 1??1?? SCROLL
      console.log('\n?? Etapa 11: Scrollando na visualização...');
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(800);
      await this.takeScreenshot(page, '11_preview_scrolled');

      console.log('\n' + '='.repeat(60));
      console.log(`? SUCESSO! ${this.screenshotCount} screenshots capturadas!`);
      console.log(`?? Salvas em: ${path.resolve(this.outputDir)}`);
      console.log('='.repeat(60));

    } catch (error) {
      console.error('\n? Erro durante execução:', error);
    } finally {
      await browser.close();
    }
  }
}

// Executar
(async () => {
  console.log('='.repeat(60));
  console.log('?? Script de Automação - Captura de Screenshots (Node.js)');
  console.log('='.repeat(60));
  console.log('?? URL Base: http://localhost:3000');
  console.log('?? Email: admin@sistema.com');
  console.log('?? Senha: password123');
  console.log('='.repeat(60) + '\n');

  const automation = new CurriculumScreenshots();
  await automation.run();
})();
