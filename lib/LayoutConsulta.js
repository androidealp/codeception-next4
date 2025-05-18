/**
 * Codeception Next4 VSCode Extension
 * 
 * This extension provides commands to analyze paths and generate test code from selections, active tabs, or all open tabs in VSCode.
 * 
 * @developer  André Luiz Pereira
 * @email	   andre@next4.com.br
 * @license    License Pública Geral do GNU v3.0 
 * 
 * @file       extension.js
 * @description VSCode extension entry point. Registers commands for path analysis and test generation for Yii2 and Laravel.
 */
class LayoutConsulta {

    constructor(typeSystem, modelgpt, textFile, setuse, activeFileName) {
        this.typeSystem = typeSystem;
        this.modelgpt = modelgpt;
        this.caminho    = '';
        this.codeTeste  = '';
        this.textFile   = textFile;
        this.setuse     = setuse;
        this.activeFileName = activeFileName;
    }

    laravel(setuse, activeFileName) {
        this.caminho = `namespace tests\\unit\\${setuse};`;
        this.codeTeste = `
		<?php
			${this.caminho}
			use ${setuse};

			class ${activeFileName} extends TestCase {
			    // codigo aqui
			}`
        return this.codeTeste;
    }

    yii2(setuse, activeFileName) {
        this.caminho = `namespace tests\\unit\\${setuse};`;
		this.codeTeste = `
					<?php
                        ${this.caminho}
						use app\\${setuse};

						class ${activeFileName} extends \\Codeception\\Test\\Unit
						 { 
   							// codigo aqui
						}`;

        return this.codeTeste;
    }

    default(setuse, activeFileName) {
        this.caminho = `Tests\\Unit\\${setuse};`;
        this.typeSystem = 'phpunit';
		this.codeTeste = `
					<?php
						${this.caminho}
						use app\\${setuse};

						class ${activeFileName} extends \\Codeception\\Test\\Unit
						{ 
   							// codigo aqui
						}`;

        return this.codeTeste;
    }

    dataConsulta(){
        const codeTeste = this.layout();
        return {
           "model":this.modelgpt, //"gpt-4o-mini",
		"messages": [
			{
				"role": "user",
				"content": `
				   Crie um teste unitário usando o codecept do ${this.typeSystem} para o seguinte código:
				   ${this.textFile}
				   Respeite a ordem de cada função sem pular até o limite dos tokens permitidos.
				   Este código esta no caminho ${this.setuse} e o nome do arquivo é ${this.activeFileName}.
				   E será enviado para o ${this.caminho}.
				   Retorne a classe com o codigo, sem explicações ou comentários com foco da estrutura abaixo.
				   ${codeTeste}

				   `
			}
		],
		"max_tokens": 16384, 
		"temperature": 0.7,
        };
    }

    layout(){
        switch (this.typeSystem) {
            case 'laravel':
                return this.laravel();
            case 'yii2':
                return this.yii2();
            default:
                return this.default();
        }
    }

}


module.exports = {LayoutConsulta};