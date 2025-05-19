<p align="center">
   <strong>CODECEPTION NEXT4 0.0.2</strong>
</p>

Generates automated unit tests via VSCode for Yii2 and Laravel so far. It can be applied to other PHP frameworks, but this has not been tested.

Tests can currently only be performed for the PHP language.

## Technologies Used

- [Codeception Yii](https://codeception.com/for/yii)
- [Codeception Laravel](https://codeception.com/for/laravel)

## Configuration

[CTRL + ,] go to extensions, locate Next Test System, and provide the path to the local unit test folder of your project where the tests will be sent, usually test/unit/. You need to do this for each project if the structure is different.

Specify which technology you are using: Yii2, Laravel, or other.

Provide your OpenAI GPT token.

And the model to be used for the tests, by default it is gpt-4o-mini.

## How to Run the Tests
[CTRL + SHIFT + P] search for NextTest.

*Checking the configuration*
 - [CTRL + SHIFT + P] NextTest: Analyze system settings
    Checks if the settings are applied and ready to generate tests

*Generate a test by selecting a function*
 - [CTRL + SHIFT + P] NextTest: Generate Test From Selection 
 - [Right-click] on the selected text, if you are in a PHP file you will see "NextTest: Generate Test From Selection"

*Generate a test from an active tab*
- [CTRL + SHIFT + P] NextTest: Generate complete test for active tab
   Generates a test for the open PHP document in the active tab

*Generate tests for all open tabs*
- [CTRL + SHIFT + P] NextTest: Generate complete test for all tabs
   The system will recursively go through each tab and generate a minimal test for each one

## Contribution
Feel free to open issues or pull requests to improve the tests.

### Contributors
| Name                      | Contact                                 | Agency   | Website                     |
|---------------------------|-----------------------------------------|----------|-----------------------------|
| André Luiz Pereira        | [andre@next4.com.br](mailto:andre@next4.com.br) | Next4    | [next4.com.br](https://www.next4.com.br) |


## License

GNU General Public License v3.0
