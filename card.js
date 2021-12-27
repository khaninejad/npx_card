#!/usr/bin/env node

'use strict'

const boxen = require("boxen");
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");
const open = require("open");
const fs = require('fs');
const request = require('request');
const path = require('path');
const ora = require('ora');
const cliSpinners = require('cli-spinners');
const { Observable } = require('rxjs');
var ui = new inquirer.ui.BottomBar();
const https = require('https')
clear();
require('dotenv').config()

const prompt = inquirer.createPromptModule();
let userInfoDetail = "";
const observe = Observable.create((obs) => {
    obs.next({
      type: 'input',
      name: 'first_name',
      message: "What's your first name",
      default() {
        return 'john';
      },
    });
  
    obs.next({
      type: 'input',
      name: 'last_name',
      message: "What's your last name",
      default() {
        return 'Doe';
      },
    });
  
    obs.next({
      type: 'input',
      name: 'company',
      message: "What's your company name",
      default() {
        return 'Google';
      },
    });
  
    obs.next({
      type: 'input',
      name: 'position',
      message: "What's your current position in your current company ",
      default() {
        return 'HR';
      },
    });
  
    obs.next({
      type: 'input',
      name: 'email',
      message: "What's your email",
      validate(value) {
        const pass = value.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        if (pass) {
          return true;
        }
  
        return 'Please enter a valid email';
      },
    });
    obs.complete();
  });

  const output = [];
  const botQuestions = [
    {
      type: 'input',
      name: 'askQuestion',
      message: "please type your question",
      validate: async (answer) => {
        ui.log.write('typing.');
        await askQuestion("payam",answer);
        return true;
      },
    },
    {
      type: 'confirm',
      name: 'askAgain',
      message: 'If you have another question, ask again',
      default: true,
    },
  ];
  
  function ask(userinfos) {
    inquirer.prompt(botQuestions).then((answers) => {
      output.push(answers.askQuestion);
      if (answers.askAgain) {
        ask();
      } else {
        console.log('Thank you for connecting. please feel free to contact me');
      }
    });
  }

const questions = [
    {
        type: "list",
        name: "action",
        message: "What you want to do?",
        choices: [
            {
                name: `Send me an ${chalk.green.bold("email")}?`,
                value: () => {
                    open("mailto:khaninejad@gmail.com");
                    console.log("\nDone, see you soon at inbox.\n");
                }
            },
            {
                name: `offline ${chalk.yellowBright.bold("Interview")}?`,
                value: () => {
                    console.log("\nLet's meet.\n");
                    inquirer.prompt(observe).then((answers) => {
                        if (answers.position.includes('developer')){
                            console.log('Hello dude,');
                          }else if (answers.position.includes('developer')){
                            console.log('Hello future boss :D' );
                          }else{
                            console.log('Hello '+ answers.first_name + ' ' + answers.last_name + ', ' );
                          }
                          console.log("\nNow you're going to connect with my assistant, feel free to ask anything you like.\n");
                        userInfoDetail = answers;
                        ask();
                      });
                      
                }
            },
            {
                name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
                value: () => {
                    // cliSpinners.dots;
                    const loader = ora({
                        text: ' Downloading Resume',
                        spinner: cliSpinners.material,
                    }).start();
                    let pipe = request('https://github.com/khaninejad/khaninejad/blob/main/README.md').pipe(fs.createWriteStream('./payam-khaninejad-resume.html'));
                    pipe.on("finish", function () {
                        let downloadPath = path.join(process.cwd(), 'payam-khaninejad-resume.html')
                        console.log(`\nResume Downloaded at ${downloadPath} \n`);
                        open(downloadPath)
                        loader.stop();
                    });
                }
            },
            
            {
                name: "Just quit.",
                value: () => {
                    console.log("Hasta la vista.\n");
                }
            }
        ]
    }
];

const data = {
    name: chalk.bold.green("             Payam Khaninejad"),
    handle: chalk.white("@khaninejad"),
    work: `${chalk.white("Developer at")} ${chalk
        .hex("#2b82b2")
        .bold("Coinhaven")}`,
    twitter: chalk.gray("https://twitter.com/") + chalk.cyan("khaninejad"),
    github: chalk.gray("https://github.com/") + chalk.green("khaninejad"),
    linkedin: chalk.gray("https://linkedin.com/in/") + chalk.blue("khaninejad"),
    web: chalk.cyan("https://khaninejad.ir"),
    npx: chalk.red("npx") + " " + chalk.white("payam"),

    labelWork: chalk.white.bold("       Work:"),
    labelTwitter: chalk.white.bold("    Twitter:"),
    labelGitHub: chalk.white.bold("     GitHub:"),
    labelLinkedIn: chalk.white.bold("   LinkedIn:"),
    labelWeb: chalk.white.bold("        Web:"),
    labelCard: chalk.white.bold("       Card:")
};

const me = boxen(
    [
        `${data.name}`,
        ``,
        `${data.labelWork}  ${data.work}`,
        ``,
        `${data.labelTwitter}  ${data.twitter}`,
        `${data.labelGitHub}  ${data.github}`,
        `${data.labelLinkedIn}  ${data.linkedin}`,
        `${data.labelWeb}  ${data.web}`,
        ``,
        `${data.labelCard}  ${data.npx}`,
        ``,
        `${chalk.italic(
            "I am currently looking for new opportunities,"
        )}`,
        `${chalk.italic("my inbox is always open. Whether you have a")}`,
        `${chalk.italic(
            "question or just want to say hi, I will try "
        )}`,
        `${chalk.italic(
            "my best to get back to you!"
        )}`
    ].join("\n"),
    {
        margin: 1,
        float: 'center',
        padding: 1,
        borderStyle: "single",
        borderColor: "green"
    }
);

console.log(me);
const tip = [
    `Tip: Try ${chalk.cyanBright.bold(
        "cmd/ctrl + click"
    )} on the links above`,
    '',
].join("\n");
console.log(tip);

prompt(questions).then(answer => answer.action());
async function askQuestion(userInfo, message){
    return new Promise(function(resolve, reject) {
    var request = require('request');
    var options = {
      'method': 'POST',
      'url': process.env.chatbotURL,
      'headers': {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "message": message,
        "username": userInfoDetail.email,
        "first_name":userInfoDetail.first_name,
        "last_name": userInfoDetail.last_name,
        "position": userInfoDetail.position,
        "company": userInfoDetail.company
      })
    
    };
    request(options, function (error, response) {
      if (error){
        reject();
        throw new Error(error);
      } 
      const obj = JSON.parse(response.body);
      console.log('\x1b[33m%s\x1b[0m','Payam: '+ obj.text);  //yellow
      resolve()
    });
});
    
}