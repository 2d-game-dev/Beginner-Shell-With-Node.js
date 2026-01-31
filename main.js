const readline = require("node:readline");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const builtins = ["echo", "exit", "type", "cd", "pwd", "ls"];


rl.setPrompt("$ ");
rl.prompt();

rl.on("line", (line) => {
  const input = line.trim(); //trim extra spaces but don't touch the middle part

  if (input === "exit"){
    rl.close();
    return;
  }

  if (input.startsWith("echo ")) {
    const message = input.slice(4).trim();
    console.log(message);
    rl.prompt();
    return;
  }

  if (input === "cd" || input.startsWith("cd ")) {
    const parts = input.split(" ");
    const dir = parts[1] || process.env.HOME;

    try{
      process.chdir(dir);
    } catch (err){
      console.error(`cd: ${err.message}`);
    }
    rl.prompt();
    return;
  }

  if (input === "pwd") {
    console.log(process.cwd());
    rl.prompt();
    return;
  }

  if(input === "ls"){
    fs.readdir(process.cwd(), (err, files) => {
      if (err){
        console.error(`ls: ${err.message}`);
      } else {
        files.forEach(file => console.log(file));
      }
      rl.prompt();
    });
    return;
  }

  if (input.startsWith("type")){
    const command = input.slice(4).trim();//slice(4) removes type and keeps the rest

    if (builtins.includes(command)){
      console.log(`${command} is a shell builtin`);
       rl.prompt();
    return;
    }
    
    const PATH = process.env.PATH || "";
    const pathDirs = PATH.split(path.delimiter);

    for (const dir of pathDirs){//Check each directory, one by one
      const fullPath = path.join(dir, command);

      if(fs.existsSync(fullPath)){//Does this file exist
        try{
          fs.accessSync(fullPath, fs.constants.X_OK);//If it exists — is it executable?
          console.log(`${command} is ${fullPath}`);
          rl.prompt();
          return;
        } catch{
          // Not executable, continue searching
        }
      }
    }
    console.log(`${command} not found`);
    rl.prompt();
    return;
  }

  const parts = input.split(" ");
  const command = parts[0];
  const args = parts.slice(1);

  const PATH = process.env.PATH || "";
  const pathDirs = PATH.split(path.delimiter);

  for (const dir of pathDirs) {
    const fullPath = path.join(dir, command);

    if (fs.existsSync(fullPath)) {
      try {
        fs.accessSync(fullPath, fs.constants.X_OK);

       const child = spawn(command, args, { stdio: "inherit" });
       child.on("close", () => {
        rl.prompt(); 
       })  ;    
       
        return;
      } catch {
        // exists but not executable
      }
    }
  }

 console.log(`${command}: command not found`);
  rl.prompt();
});

