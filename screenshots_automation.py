#!/usr/bin/env python3
"""
Script de automação para captura de telas do projeto Laravel + React
Fluxo: Login -> Usuários -> Perfil -> Lista de Currículos -> Currículo -> Visualização
"""

import asyncio
import os
from datetime import datetime
from pathlib import Path
import sys

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("? Playwright não está instalado!")
    print("Execute: pip install playwright")
    print("Depois: playwright install")
    sys.exit(1)


class CurriculumScreenshots:
    def __init__(self, base_url="http://localhost:3000", output_dir="screenshots"):
        self.base_url = base_url
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Credenciais
        self.email = "admin@sistema.com"
        self.password = "password123"
        
        # Contador de screenshots
        self.screenshot_count = 0
        
    async def take_screenshot(self, page, name: str, full_page: bool = True):
        """Captura uma screenshot e salva com timestamp"""
        self.screenshot_count += 1
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.screenshot_count:02d}_{name}_{timestamp}.png"
        filepath = self.output_dir / filename
        
        await page.screenshot(path=str(filepath), full_page=full_page)
        print(f"? Screenshot salva: {filename}")
        return filepath
    
    async def run(self):
        """Executa o fluxo completo de screenshots"""
        async with async_playwright() as p:
            # Configurar navegador
            browser = await p.chromium.launch(headless=False)  # Mostrar navegador
            context = await browser.new_context(viewport={"width": 1920, "height": 1080})
            page = await context.new_page()
            
            try:
                # 1?? TELA DE LOGIN
                print("\n?? Etapa 1: Capturando página de login...")
                await page.goto(f"{self.base_url}/login")
                await page.wait_for_load_state("networkidle")
                await self.take_screenshot(page, "01_login_page")
                
                # 2?? PREENCHER E SUBMETER LOGIN
                print("\n?? Etapa 2: Preenchendo formulário de login...")
                await page.fill('input[type="email"]', self.email)
                await page.fill('input[type="password"]', self.password)
                await self.take_screenshot(page, "02_login_preenchido")
                
                # Clicar no botão de login
                await page.click('button[type="submit"]')
                await page.wait_for_load_state("networkidle")
                await page.wait_for_timeout(2000)  # Aguardar carregamento
                
                # 3?? DASHBOARD/HOME APÓS LOGIN
                print("\n?? Etapa 3: Capturando dashboard após login...")
                await self.take_screenshot(page, "03_dashboard_home")
                
                # 4?? ACESSAR PÁGINA DE USUÁRIOS
                print("\n?? Etapa 4: Acessando página de usuários...")
                # Tentar encontrar link de usuários no menu
                try:
                    await page.click('a:has-text("Usuários")')
                except:
                    # Se não encontrar, tenta por URL direta
                    await page.goto(f"{self.base_url}/users")
                
                await page.wait_for_load_state("networkidle")
                await page.wait_for_timeout(1500)
                await self.take_screenshot(page, "04_lista_usuarios")
                
                # 5?? ACESSAR PERFIL DO USUÁRIO
                print("\n?? Etapa 5: Acessando perfil do usuário...")
                # Procurar pelo menu de perfil/usuário (avatar, nome, etc)
                try:
                    # Tenta clicar no avatar/menu de usuário
                    await page.click('[aria-label*="profile"], [aria-label*="user"], button:has-text("Perfil")')
                except:
                    # Ou acessa diretamente por URL
                    await page.goto(f"{self.base_url}/profile")
                
                await page.wait_for_load_state("networkidle")
                await page.wait_for_timeout(1500)
                await self.take_screenshot(page, "05_perfil_usuario")
                
                # 6?? ACESSAR LISTA DE CURRÍCULOS
                print("\n?? Etapa 6: Acessando lista de currículos...")
                try:
                    await page.click('a:has-text("Currículos"), a:has-text("Meus Currículos")')
                except:
                    await page.goto(f"{self.base_url}/resumes")
                
                await page.wait_for_load_state("networkidle")
                await page.wait_for_timeout(1500)
                await self.take_screenshot(page, "06_lista_curriculos")
                
                # 7?? CLICAR EM UM CURRÍCULO PARA EDITAR
                print("\n?? Etapa 7: Abrindo currículo para edição...")
                # Procurar pelo primeiro botão de edição/visualização
                try:
                    # Tenta clicar no primeiro currículo ou botão de edição
                    edit_button = await page.query_selector('a:has-text("Editar"), button:has-text("Editar"), .resume-item')
                    if edit_button:
                        await edit_button.click()
                    else:
                        # Se nenhum encontrado, tenta por seletor genérico
                        await page.click('a[href*="/resumes/"], button:first-of-type')
                except:
                    pass
                
                await page.wait_for_load_state("networkidle")
                await page.wait_for_timeout(1500)
                await self.take_screenshot(page, "07_edicao_curriculo")
                
                # 8?? CLICAR EM PRÉ-VISUALIZAR
                print("\n?? Etapa 8: Abrindo pré-visualização do currículo...")
                try:
                    # Procurar pelo botão de pré-visualizar
                    await page.click('button:has-text("Pré-visualizar"), button:has-text("???")')
                except:
                    # Ou tenta por seletor alternativo
                    await page.click('[aria-label*="preview"], button:has-text("Ver")')
                
                await page.wait_for_timeout(1500)
                await self.take_screenshot(page, "08_preview_modal")
                
                # 9?? CAPTURAR OPÇÃO 1 (COM SIDEBAR)
                print("\n?? Etapa 9: Visualizando Opção 1 (com sidebar)...")
                try:
                    await page.click('button:has-text("Opção 1")')
                except:
                    pass
                await page.wait_for_timeout(1000)
                await self.take_screenshot(page, "09_preview_opcao1_sidebar")
                
                # ?? CAPTURAR OPÇÃO 2 (SEM SIDEBAR)
                print("\n?? Etapa 10: Visualizando Opção 2 (sem sidebar)...")
                try:
                    await page.click('button:has-text("Opção 2")')
                except:
                    pass
                await page.wait_for_timeout(1000)
                await self.take_screenshot(page, "10_preview_opcao2_fullwidth")
                
                # 1??1?? SCROLL NA VISUALIZAÇÃO
                print("\n?? Etapa 11: Scrollando na visualização...")
                await page.evaluate("window.scrollBy(0, 500)")
                await page.wait_for_timeout(800)
                await self.take_screenshot(page, "11_preview_scrolled")
                
                print("\n" + "="*60)
                print(f"? SUCESSO! {self.screenshot_count} screenshots capturadas!")
                print(f"?? Salvas em: {self.output_dir.absolute()}")
                print("="*60)
                
            except Exception as e:
                print(f"\n? Erro durante execução: {e}")
                import traceback
                traceback.print_exc()
            
            finally:
                await browser.close()


async def main():
    print("="*60)
    print("?? Script de Automação - Captura de Screenshots")
    print("="*60)
    print(f"?? URL Base: http://localhost:3000")
    print(f"?? Email: admin@sistema.com")
    print(f"?? Senha: password123")
    print("="*60 + "\n")
    
    automation = CurriculumScreenshots()
    await automation.run()


if __name__ == "__main__":
    asyncio.run(main())
