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

const vscode = require('vscode');
const path = require('path');
const fs = require('fs');


class PreparePath {

    checkAndMountPath(){

        const config = vscode.workspace.getConfiguration('codeceptionNext4');

        if (!config) {
            vscode.window.showErrorMessage('Configuration not found in Preferences, try reinstalling the extension.');
            return;
        }

        if(!config.get('pathTest') || config.get('pathTest') === ''){
            vscode.window.showErrorMessage('The configuration file path was not found or is empty in Preferences. Please go to settings and make sure the path is provided.');
            return;
        }

        if(!config.get('system') || config.get('system') === ''){
            vscode.window.showErrorMessage('The framework was not specified in Preferences. Please check if you have selected yii2, laravel, or others.');
            return;
        }

        if(!config.get('chaveOpenIA') || config.get('chaveOpenIA') === ''){
            vscode.window.showErrorMessage('OpenAI key not found in Preferences, try reinstalling the extension.');
            return;
        }

        const folderPath = path.join(vscode.workspace.rootPath || '', config.get('pathTest'));
   
        if (!fs.existsSync(folderPath)) {
                vscode.window.showErrorMessage(`The path ${folderPath} does not exist. Please check your settings to ensure the path is correct.`);
            return;
        }

        vscode.window.showInformationMessage(`Apparently the settings are correct and the system is ready to run tests.`);
        
    }
}


module.exports = {PreparePath};