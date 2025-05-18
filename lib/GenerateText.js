/**
 * Next Test Codeception Next4 VSCode Extension
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
const vscode    = require('vscode');
const path      = require('path');
const fs        = require('fs');
const {LayoutConsulta} = require('./LayoutConsulta');

class GenerateText {
  constructor() {
    this.text = '';
  }

  recursiveGeneratePages(testFile, formatName){
    if (fs.existsSync(testFile)) {
      testFile = testFile.replace('Test.php', 'PartTest.php');
      formatName = formatName.replace('Test', 'PartTest');
      return this.recursiveGeneratePages(testFile, formatName);
    }

    return [testFile, formatName];
  }

  async callApiOpenAi(config, codeSelected, formatName, relativePathandFile) {
        if (typeof config.get('chaveOpenIA') !== 'string' || config.get('chaveOpenIA').trim() === '') {
            vscode.window.showErrorMessage("OpenAI key not found.");
            throw new Error(`OpenAI key not found.`);
        }
        let removeComments = codeSelected.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove comentários de bloco
	        removeComments = removeComments.replace(/\/\/.*$/gm, ''); // Remove comentários de linha
	        removeComments = removeComments.replace(/^\s*[\r\n]/gm, ''); // Remove linhas em branco
	        removeComments = removeComments.replace(/^\s*\/\*\*[\s\S]*?\*\//gm, ''); // Remove comentários de documentação

        let setuse = relativePathandFile.replace('/', '\\')
	    setuse =  setuse.replace('.php', '')

        const url = 'https://api.openai.com/v1/chat/completions';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.get('chaveOpenIA')}`
        };

        const layoutConsulta = new LayoutConsulta(config.get('system'), config.get('modelOpenIA'), removeComments, setuse, formatName);

        try {

            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(layoutConsulta.dataConsulta())
            });

            if (!response.ok) {
                const errorBody = await response.text();
			    throw new Error(`Error in OpenAI API: ${response.status} - ${errorBody}`);
            }

            const testContent = await response.json();
            return testContent.choices[0].message.content;

        }catch (error) {
            if (error.response) {
                console.error('Error in API response:', error.response.data);
            } else if (error.request) {
                console.error('Error in request:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        }

  }

  async buildTest(config, relativeDir, relativePathandFile, activeFileName, codeSelected) {
    try{

        const testFilePath = path.join(vscode.workspace.rootPath || '', config.get('pathTest'), relativeDir);
        let testFile = path.join(vscode.workspace.rootPath || '', config.get('pathTest'), relativePathandFile.replace('.php', 'Test.php'));
        let formatName = activeFileName.replace('.php', 'Test');
        [testFile, formatName] = this.recursiveGeneratePages(testFile, formatName);

        let testContent = await this.callApiOpenAi(config, codeSelected, formatName, relativePathandFile);
		testContent = testContent.replace('```php', '');
		testContent = testContent.replace('```', '');
		testContent = testContent.replace(/^\s*<\?php/, '<?php');

        fs.mkdirSync(testFilePath, { recursive: true });
        fs.writeFileSync(testFile, testContent, 'utf8');
        vscode.window.showInformationMessage('Test file generated successfully: ' + testFile);

    }catch(error){
        vscode.window.showErrorMessage('Error generating test file: ' + error.message);
    }
  }

  generateTextAll(){
    const allDocuments = vscode.workspace.textDocuments;
    allDocuments.forEach(doc => {
        if (doc) {
            this.generateText('active', doc.fileName, doc.getText());
        }
    });

  }

  generateText( type='selection', vscodePathActiveFile = null, codeSelected = null){
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
    }

    if(vscodePathActiveFile === null){
        vscodePathActiveFile = editor.document.fileName;
    }

    if(codeSelected === null){
        codeSelected  = (type === 'active') ? editor.document.getText() : editor.document.getText(editor.selection);
    }

    const activeFileName  = path.basename(vscodePathActiveFile);
    
    const relativePathandFile  = path.relative(vscode.workspace.rootPath, vscodePathActiveFile);
    const relativeDir          = path.dirname(relativePathandFile);

    if(activeFileName && !activeFileName.endsWith('.php')){
        vscode.window.showErrorMessage("The file extension must be PHP.");
        return;
    }

    if (!codeSelected) {
        vscode.window.showErrorMessage("You must select a piece of code.");
        return;
    }

    const config = vscode.workspace.getConfiguration('codeceptionNext4');

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Unit test being generated.... for: ${activeFileName}`,
        cancellable: false,
    }, async (progress) => {
        progress.report({ increment: 0 });
        await this.buildTest(config, relativeDir, relativePathandFile, activeFileName, codeSelected);
        progress.report({ increment: 100 });
    });

    vscode.window.showInformationMessage('Test generated successfully!');

  }
}

module.exports = { GenerateText };