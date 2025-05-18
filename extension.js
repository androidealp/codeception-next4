
/**
 * Next Test System VSCode Extension
 * 
 * This extension provides commands to analyze paths and generate test code from selections, active tabs, or all open tabs in VSCode.
 * 
 * @developer  Codeception Next4
 * @email	   andre@next4.com.br
 * @license    License Pública Geral do GNU v3.0 
 * 
 * @file       extension.js
 * @description VSCode extension entry point. Registers commands for path analysis and test generation for Yii2 and Laravel.
 */
const vscode = require('vscode');
const { PreparePath } = require('./lib/PreparePath');
const { GenerateText } = require('./lib/GenerateText');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const disposable = vscode.commands.registerCommand('codeception-next4.analisepath', function () {
		const preparePath = new PreparePath();
		preparePath.checkAndMountPath();
	});

	context.subscriptions.push(disposable);
	// manipula o seletor
	const disposableGeneratTest = vscode.commands.registerCommand('codeception-next4.generateTestFromSelection', function () {
		const generateText = new GenerateText();
		generateText.generateText();
	});
	context.subscriptions.push(disposableGeneratTest);

	const documentActive = vscode.commands.registerCommand('codeception-next4.generateTestByTabActive', function () {
		const generateText = new GenerateText();
		generateText.generateText('active');
	});
	context.subscriptions.push(documentActive);

	const allTabs = vscode.commands.registerCommand('codeception-next4.generateTestByAllTabs', function () {
		const generateText = new GenerateText();
		generateText.generateTextAll();
	});
	context.subscriptions.push(allTabs);

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
